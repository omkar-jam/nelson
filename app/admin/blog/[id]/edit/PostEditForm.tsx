'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published: boolean;
  publishedAt: Date | null;
};

export default function PostEditForm({ post }: { post: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [body, setBody] = useState(post.body);
  const [published, setPublished] = useState(post.published);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, body, published }),
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setError('Failed to delete.');
        setConfirmDelete(false);
      }
    } catch {
      setError('Something went wrong.');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Link href="/admin/blog" className="text-body-sm text-plati-soft transition hover:text-gleam">
        ← Blog
      </Link>
      <h1 className="mt-4 font-display text-display-md font-light text-paper sm:text-display-lg">
        Edit post
      </h1>
      {post.publishedAt && (
        <p className="mt-1 font-body text-caption text-plati-muted">
          Published {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

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
            className="mt-2 w-full border border-plati-border bg-plati px-3 py-2.5 font-body text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block font-body text-body-sm font-medium text-plati-soft">
            Post content
          </label>
          <p className="mt-0.5 font-body text-caption text-plati-muted">
            Use the toolbar to add headings, bold, bullet points, links, etc.
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
            {published ? 'Published (visible on site)' : 'Draft (not visible yet)'}
          </span>
        </label>

        {error && (
          <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-body-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-gleam bg-gleam/10 px-6 py-2.5 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/admin/blog"
            className="border border-plati-border px-6 py-2.5 font-body text-body-sm text-plati-soft transition hover:text-gleam"
          >
            Cancel
          </Link>
          <div className="ml-auto">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="font-body text-body-sm text-plati-soft">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="border border-red-500/50 px-4 py-2.5 font-body text-body-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="font-body text-body-sm text-plati-muted transition hover:text-plati-soft"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="font-body text-body-sm text-plati-muted transition hover:text-red-400"
              >
                Delete post
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
