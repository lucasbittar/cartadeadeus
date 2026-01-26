'use client';

import { Letter, LetterStatus } from '@/types';
import { copy } from '@/constants/copy';

interface LetterTableProps {
  letters: Letter[];
  loading: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onStatusChange: (id: string, status: LetterStatus) => void;
  onShare: (letter: Letter) => void;
}

export function LetterTable({
  letters,
  loading,
  selectedIds,
  onSelect,
  onSelectAll,
  onStatusChange,
  onShare,
}: LetterTableProps) {
  const allSelected =
    letters.length > 0 && letters.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0 && !allSelected;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: LetterStatus) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovada',
      rejected: 'Rejeitada',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (loading && letters.length === 0) {
    return (
      <div className="bg-background border border-muted-light rounded-lg overflow-hidden">
        <div className="animate-pulse p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-muted-light last:border-0">
              <div className="h-4 w-4 bg-muted-light rounded" />
              <div className="flex-1 h-4 bg-muted-light rounded" />
              <div className="w-24 h-4 bg-muted-light rounded" />
              <div className="w-24 h-4 bg-muted-light rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="bg-background border border-muted-light rounded-lg p-8 text-center">
        <p className="text-muted-dark">{copy.admin.letters.emptyState}</p>
      </div>
    );
  }

  return (
    <div className="bg-background border border-muted-light rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream border-b border-muted-light">
            <tr>
              <th className="w-10 p-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-muted-light"
                />
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.content}
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.author}
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.city}
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.status}
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.date}
              </th>
              <th className="text-right p-4 text-xs font-medium text-muted-dark uppercase tracking-wider">
                {copy.admin.letters.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted-light">
            {letters.map((letter) => (
              <tr
                key={letter.id}
                className={`hover:bg-cream/50 transition-colors ${
                  letter.flagged ? 'bg-orange-50' : ''
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(letter.id)}
                    onChange={(e) => onSelect(letter.id, e.target.checked)}
                    className="rounded border-muted-light"
                  />
                </td>
                <td className="p-4">
                  <div className="max-w-md">
                    <p className="text-sm text-foreground line-clamp-2">
                      {letter.content}
                    </p>
                    {letter.flagged && letter.flag_reason && (
                      <p className="mt-1 text-xs text-orange-600">
                        <span className="font-medium">
                          {copy.admin.letters.flagReason}:
                        </span>{' '}
                        {letter.flag_reason}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-dark">
                    {letter.is_anonymous
                      ? copy.marquee.anonymous
                      : letter.author || '-'}
                  </p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-dark">{letter.city}</p>
                </td>
                <td className="p-4">{getStatusBadge(letter.status)}</td>
                <td className="p-4">
                  <p className="text-sm text-muted-dark whitespace-nowrap">
                    {formatDate(letter.created_at)}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {letter.status !== 'approved' && (
                      <button
                        onClick={() => onStatusChange(letter.id, 'approved')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        {copy.admin.letters.actions.approve}
                      </button>
                    )}
                    {letter.status !== 'rejected' && (
                      <button
                        onClick={() => onStatusChange(letter.id, 'rejected')}
                        className="text-xs text-burgundy hover:text-burgundy/80 font-medium"
                      >
                        {copy.admin.letters.actions.reject}
                      </button>
                    )}
                    <button
                      onClick={() => onShare(letter)}
                      className="text-xs text-muted-dark hover:text-foreground font-medium"
                    >
                      {copy.admin.letters.actions.share}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
