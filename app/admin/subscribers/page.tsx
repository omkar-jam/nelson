'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Subscriber = {
  id: string;
  email: string;
  phone: string | null;
  unsubscribed: boolean;
  createdAt: string;
};

type EditState = {
  id: string;
  email: string;
  phone: string;
  unsubscribed: boolean;
} | null;

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const [editState, setEditState] = useState<EditState>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    imported: number; skipped: number; total: number; errors?: string[];
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/subscribers?all=${showAll}`);
      const data = await res.json();
      setSubscribers(data.subscribers ?? []);
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  useEffect(() => { load(); }, [load]);

  const filtered = subscribers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.email.toLowerCase().includes(q) ||
      (s.phone ?? '').toLowerCase().includes(q)
    );
  });

  // ── Edit ──────────────────────────────────────────────────────────────────
  function openEdit(s: Subscriber) {
    setEditState({ id: s.id, email: s.email, phone: s.phone ?? '', unsubscribed: s.unsubscribed });
    setEditError(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editState) return;
    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/admin/subscribers/${editState.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editState.email,
          phone: editState.phone || null,
          unsubscribed: editState.unsubscribed,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error ?? 'Save failed'); return; }
      setEditState(null);
      await load();
    } catch {
      setEditError('Request failed');
    } finally {
      setEditSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete(id: string) {
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error ?? 'Delete failed');
        return;
      }
      setDeleteId(null);
      await load();
    } catch {
      setDeleteError('Request failed');
    }
  }

  // ── Add ───────────────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addEmail, phone: addPhone || null }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? 'Failed to add'); return; }
      setAddOpen(false);
      setAddEmail('');
      setAddPhone('');
      await load();
    } catch {
      setAddError('Request failed');
    } finally {
      setAddSaving(false);
    }
  }

  // ── Import ────────────────────────────────────────────────────────────────
  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/subscribers/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setImportError(data.error ?? 'Import failed'); return; }
      setImportResult(data);
      await load();
    } catch {
      setImportError('Import request failed');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────
  function handleExport(all: boolean) {
    window.location.href = `/api/admin/subscribers/export?all=${all}`;
  }

  const activeCount = subscribers.filter((s) => !s.unsubscribed).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-lg font-light text-paper">Subscribers</h1>
          <p className="mt-1 font-body text-body-sm text-plati-muted">
            {loading ? 'Loading…' : `${activeCount} active subscriber${activeCount !== 1 ? 's' : ''}${showAll ? ` · ${subscribers.length} total` : ''}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="border border-gleam bg-gleam/10 px-3 py-1.5 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
          >
            + Add
          </button>
          <label className="cursor-pointer border border-plati-border px-3 py-1.5 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper">
            {importing ? 'Importing…' : 'Import CSV'}
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} disabled={importing} />
          </label>
          <button
            onClick={() => handleExport(false)}
            className="border border-plati-border px-3 py-1.5 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper"
          >
            Export Active
          </button>
          <button
            onClick={() => handleExport(true)}
            className="border border-plati-border px-3 py-1.5 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper"
          >
            Export All
          </button>
        </div>
      </div>

      {/* Import feedback */}
      {importError && (
        <p className="mt-4 font-body text-body-sm text-red-400">{importError}</p>
      )}
      {importResult && (
        <div className="mt-4 rounded border border-plati-border bg-plati p-3 font-body text-body-sm text-paper">
          Imported <strong>{importResult.imported}</strong> of {importResult.total}.
          {importResult.skipped > 0 && <span className="ml-1 text-plati-muted">{importResult.skipped} skipped.</span>}
          {importResult.errors && importResult.errors.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-red-400">
              {importResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
              {importResult.errors.length > 5 && <li>…and {importResult.errors.length - 5} more</li>}
            </ul>
          )}
        </div>
      )}

      {/* Controls row */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Search email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border border-plati-border bg-plati px-3 py-1.5 font-body text-body-sm text-paper placeholder-plati-muted focus:border-gleam focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-2 font-body text-body-sm text-plati-soft">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="accent-gleam"
          />
          Show unsubscribed
        </label>
      </div>

      {/* Add subscriber modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border border-plati-border bg-plati-dark p-6">
            <h2 className="font-display text-display-sm font-light text-paper">Add Subscriber</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block font-body text-body-sm text-plati-soft">Email *</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-body-sm text-paper focus:border-gleam focus:outline-none"
                  placeholder="subscriber@example.com"
                />
              </div>
              <div>
                <label className="block font-body text-body-sm text-plati-soft">Phone (optional)</label>
                <input
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-body-sm text-paper focus:border-gleam focus:outline-none"
                  placeholder="+44 7700 900000"
                />
              </div>
              {addError && <p className="font-body text-body-sm text-red-400">{addError}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={addSaving}
                  className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
                >
                  {addSaving ? 'Saving…' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAddOpen(false); setAddError(null); }}
                  className="border border-plati-border px-4 py-2 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border border-plati-border bg-plati-dark p-6">
            <h2 className="font-display text-display-sm font-light text-paper">Edit Subscriber</h2>
            <form onSubmit={saveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block font-body text-body-sm text-plati-soft">Email *</label>
                <input
                  type="email"
                  required
                  value={editState.email}
                  onChange={(e) => setEditState((prev) => prev && { ...prev, email: e.target.value })}
                  className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-body-sm text-paper focus:border-gleam focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-body text-body-sm text-plati-soft">Phone</label>
                <input
                  type="tel"
                  value={editState.phone}
                  onChange={(e) => setEditState((prev) => prev && { ...prev, phone: e.target.value })}
                  className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-body-sm text-paper focus:border-gleam focus:outline-none"
                  placeholder="+44 7700 900000"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 font-body text-body-sm text-plati-soft">
                <input
                  type="checkbox"
                  checked={editState.unsubscribed}
                  onChange={(e) => setEditState((prev) => prev && { ...prev, unsubscribed: e.target.checked })}
                  className="accent-gleam"
                />
                Unsubscribed
              </label>
              {editError && <p className="font-body text-body-sm text-red-400">{editError}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
                >
                  {editSaving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditState(null)}
                  className="border border-plati-border px-4 py-2 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm border border-plati-border bg-plati-dark p-6">
            <h2 className="font-display text-display-sm font-light text-paper">Remove subscriber?</h2>
            <p className="mt-2 font-body text-body-sm text-plati-soft">
              This permanently deletes the record. It cannot be undone.
            </p>
            {deleteError && <p className="mt-2 font-body text-body-sm text-red-400">{deleteError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => confirmDelete(deleteId)}
                className="border border-red-500 bg-red-500/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-red-400 transition hover:bg-red-500/20"
              >
                Delete
              </button>
              <button
                onClick={() => { setDeleteId(null); setDeleteError(null); }}
                className="border border-plati-border px-4 py-2 font-body text-body-sm uppercase tracking-widest text-plati-soft transition hover:text-paper"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <p className="font-body text-body-sm text-plati-muted">Loading subscribers…</p>
        ) : filtered.length === 0 ? (
          <p className="font-body text-body-sm text-plati-muted">
            {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
          </p>
        ) : (
          <table className="w-full border-collapse font-body text-body-sm">
            <thead>
              <tr className="border-b border-plati-border text-left text-plati-muted">
                <th className="pb-2 pr-4 font-normal uppercase tracking-widest">Email</th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-widest">Phone</th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-widest">Status</th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-widest">Joined</th>
                <th className="pb-2 font-normal uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-plati-border/50 transition hover:bg-plati/30 ${s.unsubscribed ? 'opacity-50' : ''}`}
                >
                  <td className="py-2.5 pr-4 text-paper">{s.email}</td>
                  <td className="py-2.5 pr-4 text-plati-soft">{s.phone ?? <span className="text-plati-muted">—</span>}</td>
                  <td className="py-2.5 pr-4">
                    {s.unsubscribed ? (
                      <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400">Unsubscribed</span>
                    ) : (
                      <span className="rounded bg-gleam/10 px-2 py-0.5 text-xs text-gleam">Active</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-plati-muted">
                    {new Date(s.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-plati-soft underline-offset-2 transition hover:text-paper hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteId(s.id); setDeleteError(null); }}
                        className="text-red-400/60 underline-offset-2 transition hover:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CSV format hint */}
      <details className="mt-10">
        <summary className="cursor-pointer font-body text-body-sm text-plati-muted hover:text-plati-soft">
          CSV import format
        </summary>
        <div className="mt-2 rounded border border-plati-border bg-plati p-4 font-mono text-xs text-plati-soft">
          <p className="mb-2 font-body text-body-sm text-plati-muted">Expected columns (header row optional):</p>
          <pre>{`email,phone
alice@example.com,+44 7700 900001
bob@example.com,`}</pre>
          <p className="mt-2 font-body text-body-sm text-plati-muted">
            Only <code>email</code> is required. Existing emails are updated (not duplicated). Unsubscribed subscribers are reactivated.
          </p>
        </div>
      </details>
    </main>
  );
}
