'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

const PRESET_SLUGS = [
  { label: 'About — artist biography', value: 'about' },
  { label: 'Other (custom)', value: '' },
];

export default function NewPagePage() {
  const router = useRouter();
  const [preset, setPreset] = useState('about');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('About');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = preset === '' ? customSlug : preset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!slug.trim()) { setError('Please choose a page type or enter a slug.'); return; }
    if (!title.trim()) { setError('Please enter a page title.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, content }),
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
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-12">
      <Link href="/admin/pages" className="text-body-sm text-plati-soft transition hover:text-gleam">
        ← Pages
      </Link>
      <h1 className="mt-4 font-display text-display-md font-light text-paper sm:text-display-lg">
        Add page
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">

        {/* Page type selector */}
        <div>
          <label className="block font-body text-body-sm font-medium text-plati-soft">
            Page type <span className="text-red-400">*</span>
          </label>
          <div className="mt-2 space-y-2">
            {PRESET_SLUGS.map(({ label, value }) => (
              <label key={value} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="preset"
                  value={value}
                  checked={preset === value}
                  onChange={() => {
                    setPreset(value);
                    if (value === 'about') setTitle('About');
                  }}
                  className="h-4 w-4 accent-gleam"
                />
                <span className="font-body text-body-sm text-plati-soft">{label}</span>
              </label>
            ))}
          </div>
          {preset === '' && (
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="page-url-slug"
              className="mt-3 w-full border border-plati-border bg-plati px-3 py-2.5 font-body text-sm text-plati-soft placeholder:text-plati-muted focus:border-gleam focus:outline-none"
            />
          )}
        </div>

        {/* Title */}
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

        {/* Content */}
        <div>
          <label className="block font-body text-body-sm font-medium text-plati-soft">
            Content
          </label>
          <p className="mt-0.5 font-body text-caption text-plati-muted">
            Use the toolbar to format text — bold, headings, bullet points, links, etc.
          </p>
          <div className="mt-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the page content here…"
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
            {loading ? 'Saving…' : 'Save page'}
          </button>
          <Link
            href="/admin/pages"
            className="border border-plati-border px-6 py-2.5 font-body text-body-sm text-plati-soft transition hover:text-gleam"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
