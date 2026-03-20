'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

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
        setError(data.error ?? 'Failed to save. Please try again.');
        return;
      }
      router.push('/admin/pages');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
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
        Edit: {page.title}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Page title */}
        <div>
          <label htmlFor="title" className="block font-body text-body-sm font-medium text-plati-soft">
            Page title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full border border-plati-border bg-plati px-3 py-2.5 font-body text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
          />
        </div>

        {/* Content editor */}
        <div>
          <label className="block font-body text-body-sm font-medium text-plati-soft">
            Page content
          </label>
          <p className="mt-0.5 font-body text-caption text-plati-muted">
            Use the toolbar to format text — bold, headings, bullet points, links, etc.
          </p>
          <div className="mt-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your page content here…"
              minHeight="18rem"
            />
          </div>
        </div>

        {error && (
          <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-body-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-gleam bg-gleam/10 px-6 py-2.5 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/admin/pages"
            className="border border-plati-border px-6 py-2.5 font-body text-body-sm text-plati-soft transition hover:text-gleam"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
