'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import type { Artwork } from '@prisma/client';

type Props = { artwork?: Artwork | null };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** XMLHttpRequest gives upload progress; fetch() does not. */
function postFormWithUploadProgress(
  path: string,
  formData: FormData,
  onProgress: (loaded: number, total: number | null) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', path);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        onProgress(ev.loaded, ev.total);
      } else {
        onProgress(ev.loaded, null);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url?: string; error?: string };
          if (data.url) resolve({ url: data.url });
          else reject(new Error(data.error || 'Upload failed'));
        } catch {
          reject(new Error('Invalid server response'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(data.error || xhr.statusText || 'Upload failed'));
        } catch {
          reject(new Error(xhr.statusText || 'Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error — check your connection')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
    xhr.send(formData);
  });
}

export function ArtworkForm({ artwork }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadBytes, setUploadBytes] = useState<{ loaded: number; total: number } | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const mediaUrlInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!artwork;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setUploadProgress(0);
    setUploadBytes({ loaded: 0, total: file.size });
    setUploadStatus(`Preparing ${file.name} (${formatBytes(file.size)})…`);

    const formData = new FormData();
    formData.set('file', file);

    try {
      const { url } = await postFormWithUploadProgress('/api/upload', formData, (loaded, total) => {
        const denom = total != null && total > 0 ? total : file.size;
        const pct = denom > 0 ? Math.min(100, Math.round((100 * loaded) / denom)) : 0;
        setUploadProgress(pct);
        setUploadBytes({ loaded, total: denom });
        if (loaded >= denom) {
          setUploadStatus('Saving to storage…');
        } else {
          setUploadStatus(`Uploading ${formatBytes(loaded)} of ${formatBytes(denom)}…`);
        }
      });

      setUploadProgress(100);
      setUploadStatus('Done');
      if (mediaUrlInputRef.current) {
        mediaUrlInputRef.current.value = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadBytes(null);
      setUploadStatus('');
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
          <label
            className={`flex shrink-0 cursor-pointer items-center border border-plati-border bg-plati px-4 py-2 text-body-sm transition hover:border-gleam hover:text-gleam ${
              uploading ? 'pointer-events-none cursor-wait text-plati-muted' : 'cursor-pointer text-plati-soft'
            }`}
          >
            <span>{uploading ? `${uploadProgress}%` : 'Upload'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>
        {uploading && (
          <div className="mt-3 space-y-2">
            <div
              className="h-1.5 w-full overflow-hidden bg-plati-border"
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div
                className="h-full bg-gleam transition-[width] duration-150 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-caption text-plati-muted">{uploadStatus}</p>
            {uploadBytes && uploadBytes.total > 0 && uploadProgress < 100 && (
              <p className="text-caption text-plati-muted/80">
                Large files can take several minutes on slow connections — keep this tab open.
              </p>
            )}
          </div>
        )}
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
