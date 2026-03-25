'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

function dateToDatetimeLocalValue(d: Date): string {
  const x = new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [publishedAtLocal, setPublishedAtLocal] = useState(() => dateToDatetimeLocalValue(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError('Please enter a title.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          body,
          published,
          ...(published ? { publishedAt: new Date(publishedAtLocal).toISOString() } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.');
        return;
      }
      router.push('/admin/blog');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-12">
      <Link href="/admin/blog" className="text-body-sm text-plati-soft transition hover:text-gleam">
        ← Blog
      </Link>
      <h1 className="mt-4 font-display text-display-md font-light text-paper sm:text-display-lg">
        New post
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">

        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-body text-body-sm font-medium text-plati-soft">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. PlatiGleam at Angkor Wat"
            required
            className="mt-2 w-full border border-plati-border bg-plati px-3 py-2.5 font-body text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block font-body text-body-sm font-medium text-plati-soft">
            Short summary
          </label>
          <p className="mt-0.5 font-body text-caption text-plati-muted">
            1–2 sentences shown on the blog listing and home page.
          </p>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="A brief description of what this post is about…"
            className="mt-2 w-full border border-plati-border bg-plati px-3 py-2.5 font-body text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block font-body text-body-sm font-medium text-plati-soft">
            Post content
          </label>
          <p className="mt-0.5 font-body text-caption text-plati-muted">
            Write your post below. Use the toolbar to add headings, bold, bullet points, links, etc.
          </p>
          <div className="mt-2">
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Start writing your post here…"
              minHeight="20rem"
            />
          </div>
        </div>

        {/* Publish toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only"
            />
            <div className={`h-6 w-11 rounded-full transition ${published ? 'bg-gleam' : 'bg-plati-border'}`} />
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="font-body text-body-sm text-plati-soft">
            {published ? 'Publish immediately (visible on site)' : 'Save as draft (not visible yet)'}
          </span>
        </label>

        {published && (
          <div>
            <label htmlFor="publishedAt" className="block font-body text-body-sm font-medium text-plati-soft">
              Published date &amp; time
            </label>
            <p className="mt-0.5 font-body text-caption text-plati-muted">
              Defaults to now; change to backdate or schedule display order.
            </p>
            <input
              id="publishedAt"
              type="datetime-local"
              value={publishedAtLocal}
              onChange={(e) => setPublishedAtLocal(e.target.value)}
              className="mt-2 w-full max-w-md border border-plati-border bg-plati px-3 py-2.5 font-body text-paper focus:border-gleam focus:outline-none"
            />
          </div>
        )}

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
            {loading ? 'Saving…' : published ? 'Publish post' : 'Save draft'}
          </button>
          <Link
            href="/admin/blog"
            className="border border-plati-border px-6 py-2.5 font-body text-body-sm text-plati-soft transition hover:text-gleam"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
