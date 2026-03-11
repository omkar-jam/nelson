'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Page = { id: string; slug: string; title: string; content: string };

export default function PageEditForm({ page }: { page: Page }) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: page.slug, title, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Failed to save');
        return;
      }
      router.push('/admin/pages');
      router.refresh();
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link href="/admin/pages" className="text-body-sm text-plati-soft transition hover:text-gleam">
        ← Pages
      </Link>
      <h1 className="mt-4 font-display text-display-md font-light text-paper sm:text-display-lg">
        Edit: {page.slug}
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <span className="block font-body text-body-sm text-plati-muted">Slug</span>
          <p className="mt-1 font-body text-paper">{page.slug}</p>
        </div>
        <div>
          <label htmlFor="title" className="block font-body text-body-sm text-plati-soft">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="content" className="block font-body text-body-sm text-plati-soft">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
          />
        </div>
        {error && <p className="font-body text-body-sm text-red-400">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
          <Link href="/admin/pages" className="border border-plati-border px-4 py-2 font-body text-body-sm text-plati-soft transition hover:text-gleam">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
