'use client';

import { useEffect, useState, useCallback } from 'react';
import { copy } from '@/constants/copy';
import { formatEventDateShort } from '@/lib/format-date';
import type { TourDate, TourDateStatus } from '@/types';

const t = copy.admin.tourDates;

interface FormState {
  event_date: string;
  venue: string;
  city: string;
  ticket_url: string;
  status: TourDateStatus;
}

const EMPTY_FORM: FormState = {
  event_date: '',
  venue: '',
  city: '',
  ticket_url: '',
  status: 'on_sale',
};

const STATUS_LABELS: Record<TourDateStatus, string> = {
  on_sale: t.form.statusOnSale,
  sold_out: t.form.statusSoldOut,
  cancelled: t.form.statusCancelled,
  free: t.form.statusFree,
};

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-muted-light bg-background text-foreground ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30 ' +
  'focus:border-burgundy transition-all text-sm';

export default function AdminTourDatesPage() {
  const [dates, setDates] = useState<TourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tour-dates');
      if (!res.ok) throw new Error('load failed');
      setDates(await res.json());
      setError(null);
    } catch {
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (d: TourDate) => {
    setEditingId(d.id);
    setForm({
      event_date: d.event_date.slice(0, 16),
      venue: d.venue,
      city: d.city,
      ticket_url: d.ticket_url ?? '',
      status: d.status,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch(
        editingId ? `/api/admin/tour-dates/${editingId}` : '/api/admin/tour-dates',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'save failed');
      }
      closeForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.deleteConfirm)) return;
    const res = await fetch(`/api/admin/tour-dates/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          {t.title}
        </h2>
        {!showForm && (
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-burgundy text-white text-sm font-medium hover:bg-burgundy-600 transition-colors"
          >
            {t.addButton}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-background border border-muted-light rounded-lg p-5 md:p-6 mb-6"
        >
          <h3 className="font-medium text-foreground mb-4">
            {editingId ? t.editTitle : t.newTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="block text-muted-dark mb-1.5">{t.form.date}</span>
              <input
                type="datetime-local"
                required
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm">
              <span className="block text-muted-dark mb-1.5">{t.form.status}</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TourDateStatus })
                }
                className={inputClass}
              >
                {(Object.keys(STATUS_LABELS) as TourDateStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-muted-dark mb-1.5">{t.form.venue}</span>
              <input
                type="text"
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm">
              <span className="block text-muted-dark mb-1.5">{t.form.city}</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="block text-muted-dark mb-1.5">{t.form.ticketUrl}</span>
              <input
                type="url"
                placeholder="https://"
                value={form.ticket_url}
                onChange={(e) => setForm({ ...form, ticket_url: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          {formError && (
            <p className="mt-4 text-sm text-red-400">{formError}</p>
          )}

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-burgundy text-white text-sm font-medium hover:bg-burgundy-600 transition-colors disabled:opacity-50"
            >
              {saving ? t.form.saving : t.form.save}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg text-sm text-muted-dark hover:text-foreground transition-colors"
            >
              {t.form.cancel}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-background border border-muted-light rounded-lg h-20 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : dates.length === 0 ? (
        <p className="text-muted-dark text-sm">{t.emptyState}</p>
      ) : (
        <div className="space-y-3">
          {dates.map((d) => (
            <div
              key={d.id}
              className="bg-background border border-muted-light rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-jetbrains text-xs text-burgundy-300 mb-1">
                  {formatEventDateShort(d.event_date)}
                </p>
                <p className="font-medium text-foreground truncate">{d.venue}</p>
                <p className="text-sm text-muted-dark truncate">
                  {d.city}
                  {d.status !== 'on_sale' && (
                    <span className="ml-2 text-burgundy-300">
                      · {STATUS_LABELS[d.status]}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(d)}
                  className="px-3 py-1.5 rounded-md text-xs text-muted-dark hover:text-foreground hover:bg-surface transition-colors"
                >
                  {t.editTitle}
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-3 py-1.5 rounded-md text-xs text-burgundy-300 hover:bg-burgundy/10 transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
