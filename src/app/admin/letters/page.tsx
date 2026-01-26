'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Letter, LetterStatus } from '@/types';
import { copy } from '@/constants/copy';
import { LetterTable } from '@/components/admin/letter-table';
import { AdminShareModal } from '@/components/admin/admin-share-modal';

type FilterType = 'all' | 'pending' | 'flagged' | 'approved' | 'rejected';

export default function AdminLettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [shareModalLetter, setShareModalLetter] = useState<Letter | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get('filter') as FilterType | null;
  const filter: FilterType = filterParam || 'all';

  const fetchLetters = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '50',
      });

      if (filter !== 'all') {
        if (filter === 'flagged') {
          params.set('flagged', 'true');
        } else {
          params.set('status', filter);
        }
      }

      if (search) {
        params.set('search', search);
      }

      const response = await fetch(`/api/admin/letters?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setLetters(data.letters);
        } else {
          setLetters((prev) => [...prev, ...data.letters]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
    fetchLetters(1, true);
  }, [filter, search, fetchLetters]);

  const handleFilterChange = (newFilter: FilterType) => {
    const params = new URLSearchParams(searchParams);
    if (newFilter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', newFilter);
    }
    router.push(`/admin/letters?${params}`);
  };

  const handleStatusChange = async (id: string, status: LetterStatus) => {
    try {
      const response = await fetch(`/api/admin/letters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setLetters((prev) =>
          prev.map((letter) =>
            letter.id === id ? { ...letter, status } : letter
          )
        );
      }
    } catch (error) {
      console.error('Error updating letter:', error);
    }
  };

  const handleBulkAction = async (status: LetterStatus) => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch('/api/admin/letters/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), status }),
      });

      if (response.ok) {
        setLetters((prev) =>
          prev.map((letter) =>
            selectedIds.has(letter.id) ? { ...letter, status } : letter
          )
        );
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Error bulk updating letters:', error);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(letters.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLetters(nextPage);
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: copy.admin.letters.filters.all },
    { key: 'pending', label: copy.admin.letters.filters.pending },
    { key: 'flagged', label: copy.admin.letters.filters.flagged },
    { key: 'approved', label: copy.admin.letters.filters.approved },
    { key: 'rejected', label: copy.admin.letters.filters.rejected },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          {copy.admin.letters.title}
        </h2>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 mb-4 md:mb-6">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-1 bg-background border border-muted-light rounded-lg p-1 w-fit">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-2.5 md:px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors whitespace-nowrap ${
                  filter === f.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-dark hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por conteudo ou autor..."
          className="w-full md:max-w-xs px-4 py-2 border border-muted-light rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors text-sm"
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 bg-background border border-muted-light rounded-lg px-3 md:px-4 py-2 md:py-3">
          <span className="text-xs md:text-sm text-muted-dark">
            {selectedIds.size} selecionada{selectedIds.size !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => handleBulkAction('approved')}
            className="text-xs md:text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {copy.admin.letters.bulkActions.approveSelected}
          </button>
          <button
            onClick={() => handleBulkAction('rejected')}
            className="text-xs md:text-sm text-burgundy hover:text-burgundy/80 font-medium"
          >
            {copy.admin.letters.bulkActions.rejectSelected}
          </button>
        </div>
      )}

      {/* Letters Table */}
      <LetterTable
        letters={letters}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onStatusChange={handleStatusChange}
        onShare={setShareModalLetter}
      />

      {/* Load More */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 border border-muted-light rounded-lg text-sm text-muted-dark hover:text-foreground hover:border-foreground transition-colors"
          >
            Carregar mais
          </button>
        </div>
      )}

      {/* Share Modal */}
      {shareModalLetter && (
        <AdminShareModal
          letter={shareModalLetter}
          onClose={() => setShareModalLetter(null)}
        />
      )}
    </div>
  );
}
