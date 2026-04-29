'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatBytes, postFormWithUploadProgress } from '@/lib/upload-client';

type Settings = {
  hero_video_url: string;
  hero_video_poster_url: string;
  bio_intro: string;
  bio_more: string;
  contact_intro: string;
  contact_email: string;
  contact_phone: string;
  studio_name: string;
  studio_address: string;
  studio_city: string;
  studio_postcode: string;
  social_linkedin: string;
  social_instagram: string;
  social_youtube: string;
  social_facebook: string;
};

const labelClass = 'block font-body text-body-sm text-plati-soft mb-1';
const inputClass =
  'w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none';
const textareaClass =
  'w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none resize-y';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-plati-border bg-plati p-6 space-y-4">
      <h2 className="font-display text-display-sm font-light text-gleam">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="mb-1 font-body text-caption text-plati-muted">{hint}</p>}
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  /** Bumped after local mutations so a slow initial GET cannot overwrite state (e.g. post-upload URL). */
  const settingsFetchGenRef = useRef(0);
  const settingsRef = useRef<Settings | null>(null);
  settingsRef.current = settings;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const [heroUploadBytes, setHeroUploadBytes] = useState<{ loaded: number; total: number } | null>(
    null
  );
  const [heroUploadStatus, setHeroUploadStatus] = useState('');
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const [posterUploading, setPosterUploading] = useState(false);
  const [posterUploadProgress, setPosterUploadProgress] = useState(0);
  const [posterUploadBytes, setPosterUploadBytes] = useState<{ loaded: number; total: number } | null>(
    null
  );
  const [posterUploadStatus, setPosterUploadStatus] = useState('');
  const [posterUploadError, setPosterUploadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    const genAtStart = settingsFetchGenRef.current;
    try {
      const res = await fetch('/api/admin/settings', { signal });
      if (!res.ok) throw new Error('Failed to load');
      const data = (await res.json()) as Settings;
      if (signal?.aborted) return;
      if (genAtStart !== settingsFetchGenRef.current) return;
      setSettings(data);
      setError(null);
    } catch (e) {
      if (
        signal?.aborted ||
        (e instanceof Error && e.name === 'AbortError') ||
        (typeof e === 'object' && e !== null && 'name' in e && (e as { name: string }).name === 'AbortError')
      ) {
        return;
      }
      setError('Failed to load settings');
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));

  async function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroUploadError(null);
    setHeroUploadProgress(0);
    setHeroUploadBytes({ loaded: 0, total: file.size });
    setHeroUploadStatus(`Preparing ${file.name} (${formatBytes(file.size)})…`);

    const formData = new FormData();
    formData.set('file', file);

    try {
      const { url } = await postFormWithUploadProgress(
        '/api/upload?folder=hero',
        formData,
        (loaded, total) => {
          const denom = total != null && total > 0 ? total : file.size;
          const pct = denom > 0 ? Math.min(100, Math.round((100 * loaded) / denom)) : 0;
          setHeroUploadProgress(pct);
          setHeroUploadBytes({ loaded, total: denom });
          if (loaded >= denom) {
            setHeroUploadStatus('Saving to storage…');
          } else {
            setHeroUploadStatus(`Uploading ${formatBytes(loaded)} of ${formatBytes(denom)}…`);
          }
        }
      );

      const prev = settingsRef.current;
      if (!prev) throw new Error('Settings not loaded');

      settingsFetchGenRef.current += 1;
      const next = { ...prev, hero_video_url: url };
      setSettings(next);

      setHeroUploadProgress(100);
      setHeroUploadStatus('Saving site settings…');

      const saveRes = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const saveData = (await saveRes.json().catch(() => ({}))) as { error?: string };
      if (!saveRes.ok) throw new Error(saveData.error ?? 'Could not save hero URL to the database');

      setHeroUploadStatus('Uploaded and saved — live site updated.');
      setSaved(true);
      setTimeout(() => setSaved(false), 3200);
    } catch (err) {
      setHeroUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setHeroUploading(false);
      setHeroUploadProgress(0);
      setHeroUploadBytes(null);
      setTimeout(() => setHeroUploadStatus(''), 4500);
      e.target.value = '';
    }
  }

  async function handlePosterFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterUploading(true);
    setPosterUploadError(null);
    setPosterUploadProgress(0);
    setPosterUploadBytes({ loaded: 0, total: file.size });
    setPosterUploadStatus(`Preparing ${file.name} (${formatBytes(file.size)})…`);

    const formData = new FormData();
    formData.set('file', file);

    try {
      const { url } = await postFormWithUploadProgress(
        '/api/upload?folder=hero_poster',
        formData,
        (loaded, total) => {
          const denom = total != null && total > 0 ? total : file.size;
          const pct = denom > 0 ? Math.min(100, Math.round((100 * loaded) / denom)) : 0;
          setPosterUploadProgress(pct);
          setPosterUploadBytes({ loaded, total: denom });
          if (loaded >= denom) {
            setPosterUploadStatus('Saving to storage…');
          } else {
            setPosterUploadStatus(`Uploading ${formatBytes(loaded)} of ${formatBytes(denom)}…`);
          }
        }
      );

      const prev = settingsRef.current;
      if (!prev) throw new Error('Settings not loaded');

      settingsFetchGenRef.current += 1;
      const next = { ...prev, hero_video_poster_url: url };
      setSettings(next);

      setPosterUploadProgress(100);
      setPosterUploadStatus('Saving site settings…');

      const saveRes = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const saveData = (await saveRes.json().catch(() => ({}))) as { error?: string };
      if (!saveRes.ok) throw new Error(saveData.error ?? 'Could not save poster URL to the database');

      setPosterUploadStatus('Uploaded and saved — live site updated.');
      setSaved(true);
      setTimeout(() => setSaved(false), 3200);
    } catch (err) {
      setPosterUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setPosterUploading(false);
      setPosterUploadProgress(0);
      setPosterUploadBytes(null);
      setTimeout(() => setPosterUploadStatus(''), 4500);
      e.target.value = '';
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-12">
        <p className="text-plati-soft font-body">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-12">
      <h1 className="font-display text-display-lg font-light text-paper">Site Settings</h1>
      <p className="mt-2 font-body text-body text-plati-soft">
        Edit the content shown on your public site. Hero uploads save the new URL immediately; other edits use Save below.
      </p>

      <form onSubmit={handleSave} className="mt-10 space-y-8">

        <Section title="Hero Video">
          <Field
            label="Hero video URL"
            hint="Upload saves to storage and updates the site automatically. You can also paste a direct URL (R2, .mp4, .mov), YouTube link, or use /videos/drone-hero.mov for the bundled default."
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.hero_video_url}
                onChange={(e) => set('hero_video_url', e.target.value)}
                className={inputClass + ' flex-1'}
                placeholder="/videos/drone-hero.mov"
              />
              <label
                className={`flex shrink-0 cursor-pointer items-center border border-plati-border bg-plati px-4 py-2 font-body text-body-sm transition hover:border-gleam hover:text-gleam ${
                  heroUploading
                    ? 'pointer-events-none cursor-wait text-plati-muted'
                    : 'cursor-pointer text-plati-soft'
                }`}
              >
                <span>{heroUploading ? `${heroUploadProgress}%` : 'Upload'}</span>
                <input
                  type="file"
                  accept="video/*,.mp4,.mov,.webm,.mkv,.m4v"
                  className="hidden"
                  disabled={heroUploading}
                  onChange={handleHeroFileChange}
                />
              </label>
            </div>
          </Field>
          {heroUploadError && (
            <p className="font-body text-body-sm text-red-400">{heroUploadError}</p>
          )}
          {heroUploading && (
            <div className="space-y-2">
              <div
                className="h-1.5 w-full overflow-hidden bg-plati-border"
                role="progressbar"
                aria-valuenow={heroUploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Hero video upload progress"
              >
                <div
                  className="h-full bg-gleam transition-[width] duration-150 ease-out"
                  style={{ width: `${heroUploadProgress}%` }}
                />
              </div>
              <p className="font-body text-caption text-plati-muted">{heroUploadStatus}</p>
              {heroUploadBytes && heroUploadBytes.total > 0 && heroUploadProgress < 100 && (
                <p className="font-body text-caption text-plati-muted/80">
                  Large files can take several minutes on slow connections — keep this tab open.
                </p>
              )}
            </div>
          )}
          {!heroUploading && heroUploadStatus && (
            <p className="font-body text-caption text-gleam">{heroUploadStatus}</p>
          )}
          <Field
            label="Hero poster image (optional)"
            hint="Upload saves to storage and updates the site automatically. Or paste an image URL (JPG, PNG, WebP). Leave empty for no poster."
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.hero_video_poster_url}
                onChange={(e) => set('hero_video_poster_url', e.target.value)}
                className={inputClass + ' flex-1'}
                placeholder="https://…"
              />
              <label
                className={`flex shrink-0 cursor-pointer items-center border border-plati-border bg-plati px-4 py-2 font-body text-body-sm transition hover:border-gleam hover:text-gleam ${
                  posterUploading
                    ? 'pointer-events-none cursor-wait text-plati-muted'
                    : 'cursor-pointer text-plati-soft'
                }`}
              >
                <span>{posterUploading ? `${posterUploadProgress}%` : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif"
                  className="hidden"
                  disabled={posterUploading}
                  onChange={handlePosterFileChange}
                />
              </label>
            </div>
          </Field>
          {posterUploadError && (
            <p className="font-body text-body-sm text-red-400">{posterUploadError}</p>
          )}
          {posterUploading && (
            <div className="space-y-2">
              <div
                className="h-1.5 w-full overflow-hidden bg-plati-border"
                role="progressbar"
                aria-valuenow={posterUploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Poster upload progress"
              >
                <div
                  className="h-full bg-gleam transition-[width] duration-150 ease-out"
                  style={{ width: `${posterUploadProgress}%` }}
                />
              </div>
              <p className="font-body text-caption text-plati-muted">{posterUploadStatus}</p>
              {posterUploadBytes && posterUploadBytes.total > 0 && posterUploadProgress < 100 && (
                <p className="font-body text-caption text-plati-muted/80">
                  Large images may take a moment — keep this tab open.
                </p>
              )}
            </div>
          )}
          {!posterUploading && posterUploadStatus && (
            <p className="font-body text-caption text-gleam">{posterUploadStatus}</p>
          )}
          {settings.hero_video_url && (
            <video
              key={settings.hero_video_url}
              src={settings.hero_video_url}
              poster={settings.hero_video_poster_url || undefined}
              muted
              autoPlay
              loop
              playsInline
              className="mt-2 aspect-video w-full border border-plati-border object-cover"
            />
          )}
        </Section>

        <Section title="Artist Bio">
          <Field label="Bio intro paragraph">
            <textarea
              rows={4}
              value={settings.bio_intro}
              onChange={(e) => set('bio_intro', e.target.value)}
              className={textareaClass}
            />
          </Field>
          <Field
            label="Extended bio (shown on 'Read more')"
            hint="One paragraph per line. Each line becomes a separate paragraph."
          >
            <textarea
              rows={8}
              value={(() => {
                try {
                  return (JSON.parse(settings.bio_more) as string[]).join('\n\n');
                } catch {
                  return settings.bio_more;
                }
              })()}
              onChange={(e) => {
                const paras = e.target.value.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
                set('bio_more', JSON.stringify(paras));
              }}
              className={textareaClass}
            />
          </Field>
        </Section>

        <Section title="Contact & Studio">
          <Field label="Contact intro text">
            <textarea
              rows={3}
              value={settings.contact_intro}
              onChange={(e) => set('contact_intro', e.target.value)}
              className={textareaClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact email">
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => set('contact_email', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Contact phone">
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => set('contact_phone', e.target.value)}
                className={inputClass}
                placeholder="+447950930301"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Studio name">
              <input
                type="text"
                value={settings.studio_name}
                onChange={(e) => set('studio_name', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Studio address">
              <input
                type="text"
                value={settings.studio_address}
                onChange={(e) => set('studio_address', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="City">
              <input
                type="text"
                value={settings.studio_city}
                onChange={(e) => set('studio_city', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Postcode">
              <input
                type="text"
                value={settings.studio_postcode}
                onChange={(e) => set('studio_postcode', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="Social Links">
          {(
            [
              { key: 'social_linkedin', label: 'LinkedIn URL' },
              { key: 'social_instagram', label: 'Instagram URL' },
              { key: 'social_youtube', label: 'YouTube URL' },
              { key: 'social_facebook', label: 'Facebook URL' },
            ] as { key: keyof Settings; label: string }[]
          ).map(({ key, label }) => (
            <Field key={key} label={label}>
              <input
                type="url"
                value={settings[key]}
                onChange={(e) => set(key, e.target.value)}
                className={inputClass}
              />
            </Field>
          ))}
        </Section>

        {error && <p className="font-body text-body-sm text-red-400">{error}</p>}
        {saved && <p className="font-body text-body-sm text-gleam">Saved successfully.</p>}

        <button
          type="submit"
          disabled={saving}
          className="border border-gleam bg-gleam/10 px-6 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save all settings'}
        </button>
      </form>
    </main>
  );
}
