'use client';

import { useState, useEffect, useCallback } from 'react';

type Settings = {
  hero_video_url: string;
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch {
      setError('Failed to load settings');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));

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
        Edit the content shown on your public site. Changes are live immediately after saving.
      </p>

      <form onSubmit={handleSave} className="mt-10 space-y-8">

        <Section title="Hero Video">
          <Field
            label="Hero video URL"
            hint="Paste a direct video URL (R2, .mp4, .mov) or leave as /videos/drone-hero.mov to use the default."
          >
            <input
              type="url"
              value={settings.hero_video_url}
              onChange={(e) => set('hero_video_url', e.target.value)}
              className={inputClass}
              placeholder="/videos/drone-hero.mov"
            />
          </Field>
          {settings.hero_video_url && (
            <video
              key={settings.hero_video_url}
              src={settings.hero_video_url}
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
