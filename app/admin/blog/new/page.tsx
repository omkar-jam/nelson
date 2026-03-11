'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          excerpt,
          body,
          published,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Failed to save');
        return;
      }
      router.push('/admin/blog');
      router.refresh();
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <Link href="/admin/blog" className="text-body-sm text-plati-soft transition hover:text-gleam">
        ← Blog
      </Link>
      <h1 className="mt-4 font-display text-display-md font-light text-paper sm:text-display-lg">New post</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
          <label htmlFor="slug" className="block font-body text-body-sm text-plati-soft">Slug (URL)</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title if empty"
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block font-body text-body-sm text-plati-soft">Excerpt (short summary)</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="body" className="block font-body text-body-sm text-plati-soft">Body (HTML supported)</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 border-plati-border"
          />
          <label htmlFor="published" className="font-body text-body-sm text-plati-soft">Publish now</label>
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
          <Link href="/admin/blog" className="border border-plati-border px-4 py-2 font-body text-body-sm text-plati-soft transition hover:text-gleam">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
