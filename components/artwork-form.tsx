'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import type { Artwork } from '@prisma/client';

type Props = { artwork?: Artwork | null };

export function ArtworkForm({ artwork }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const mediaUrlInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!artwork;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }
      const { url } = await res.json();
      if (mediaUrlInputRef.current) {
        mediaUrlInputRef.current.value = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || null;
    const year = formData.get('year') ? Number(formData.get('year')) : null;
    const mediaUrl = formData.get('mediaUrl') as string;
    const thumbUrl = (formData.get('thumbUrl') as string) || null;
    const order = formData.get('order') ? Number(formData.get('order')) : 0;

    try {
      if (isEdit) {
        const res = await fetch(`/api/artworks/${artwork.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            year,
            mediaUrl,
            thumbUrl,
            order,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        router.push(`/admin/artworks/${artwork.id}`);
      } else {
        const res = await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            year,
            mediaUrl,
            thumbUrl,
            order,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        router.push(`/admin/artworks/${created.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border border-plati-border bg-plati-dark px-3 py-2 text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none';
  const labelClass = 'mb-1 block text-body-sm font-medium text-plati-soft';

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <p className="rounded border border-red-500/50 bg-red-500/10 p-3 text-body-sm text-red-400">{error}</p>
      )}
      <div>
        <label htmlFor="title" className={labelClass}>Title *</label>
        <input
          id="title"
          name="title"
          defaultValue={artwork?.title}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={artwork?.description ?? ''}
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </div>
      <div>
        <label htmlFor="year" className={labelClass}>Year</label>
        <input
          id="year"
          name="year"
          type="number"
          defaultValue={artwork?.year ?? ''}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="mediaUrl" className={labelClass}>Image / video URL *</label>
        <div className="flex gap-2">
          <input
            ref={mediaUrlInputRef}
            id="mediaUrl"
            name="mediaUrl"
            type="url"
            defaultValue={artwork?.mediaUrl ?? ''}
            required
            placeholder="https://... or upload below"
            className={inputClass + ' flex-1'}
          />
          <label className="flex cursor-pointer items-center border border-plati-border bg-plati px-4 py-2 text-body-sm text-plati-soft transition hover:border-gleam hover:text-gleam">
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="thumbUrl" className={labelClass}>Thumbnail URL (optional)</label>
        <input
          id="thumbUrl"
          name="thumbUrl"
          type="url"
          defaultValue={artwork?.thumbUrl ?? ''}
          placeholder="https://..."
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="order" className={labelClass}>Order</label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={artwork?.order ?? 0}
          className={inputClass}
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="border border-gleam bg-gleam/10 px-6 py-2.5 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
}
