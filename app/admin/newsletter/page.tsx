'use client';

import { useState, useEffect } from 'react';

type SubscriberCount = { count: number } | null;

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
    errors?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<SubscriberCount>(null);

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then((res) => res.json())
      .then((data) => {
        if (data.count !== undefined) setSubscriberCount({ count: data.count });
      })
      .catch(() => setSubscriberCount({ count: 0 }));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Failed to send');
        return;
      }
      setResult({
        sent: data.sent,
        failed: data.failed,
        total: data.total,
        errors: data.errors,
      });
      setSubject('');
      setText('');
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      <h1 className="font-display text-display-lg font-light text-paper">
        Newsletter
      </h1>
      <p className="mt-2 text-body text-plati-soft">
        Send an email to all mailing list subscribers. Make sure SMTP is configured in .env.
      </p>

      {subscriberCount !== null && (
        <p className="mt-2 font-body text-body-sm text-plati-muted">
          <strong>{subscriberCount.count}</strong> active subscriber
          {subscriberCount.count !== 1 ? 's' : ''}.
        </p>
      )}

      <form onSubmit={handleSend} className="mt-10 max-w-2xl space-y-6">
        <div>
          <label htmlFor="subject" className="block font-body text-body-sm text-plati-soft">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
            placeholder="e.g. New exhibition opening"
          />
        </div>
        <div>
          <label htmlFor="text" className="block font-body text-body-sm text-plati-soft">
            Message (plain text)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={12}
            className="mt-1 w-full border border-plati-border bg-plati px-3 py-2 font-body text-paper focus:border-gleam focus:outline-none"
            placeholder="Write your newsletter content here. Line breaks are preserved."
          />
        </div>
        {error && (
          <p className="font-body text-body-sm text-red-400">{error}</p>
        )}
        {result && (
          <div className="rounded border border-plati-border bg-plati p-4 font-body text-body-sm text-paper">
            Sent to <strong>{result.sent}</strong> of {result.total} subscriber
            {result.total !== 1 ? 's' : ''}.
            {result.failed > 0 && (
              <span className="ml-1 text-red-400">
                {result.failed} failed.
              </span>
            )}
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-plati-muted">
                {result.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {result.errors.length > 5 && (
                  <li>… and {result.errors.length - 5} more</li>
                )}
              </ul>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || (subscriberCount !== null && subscriberCount.count === 0)}
          className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send to subscribers'}
        </button>
      </form>
    </main>
  );
}
