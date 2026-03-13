/**
 * Email sending via Resend (HTTP API). Works on Render and other hosts that block SMTP.
 * Set RESEND_API_KEY and EMAIL_FROM in environment.
 */

const RESEND_API = 'https://api.resend.com/emails';

function getFrom(): string {
  const from = process.env.EMAIL_FROM || process.env.RESEND_FROM;
  if (!from) {
    throw new Error(
      'Email not configured: set EMAIL_FROM (e.g. "Nelson Ferreira <onboarding@resend.dev>") in .env'
    );
  }
  return from;
}

function getApiKey(): string {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('Email not configured: set RESEND_API_KEY in .env (get one at resend.com)');
  }
  return key;
}

export type SendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
};

export async function sendMail(options: SendMailOptions): Promise<void> {
  const apiKey = getApiKey();
  const from = options.from || getFrom();
  const html = options.html ?? options.text.replace(/\n/g, '<br>\n');

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [options.to],
      subject: options.subject,
      text: options.text,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { message?: string }).message || res.statusText || `HTTP ${res.status}`;
    throw new Error(`Resend: ${msg}`);
  }
}

/** Send the same message to many recipients. Sends one-by-one to avoid rate limits and track failures. */
export async function sendBulk(
  recipients: string[],
  subject: string,
  text: string,
  html?: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const apiKey = getApiKey();
  const from = getFrom();
  const htmlBody = html ?? text.replace(/\n/g, '<br>\n');

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const to of recipients) {
    try {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { message?: string }).message || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      sent++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${to}: ${msg}`);
    }
  }

  return { sent, failed, errors };
}
