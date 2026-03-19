/**
 * Email sending via Sender.net (HTTP API). Works on Render and other hosts that block SMTP.
 * Set SENDER_API_KEY and EMAIL_FROM in environment.
 */

const SENDER_API = 'https://api.sender.net/v2/message/send';

/** Parse "Name <email@domain.com>" or plain "email@domain.com" into {name, email}. */
function parseAddress(address: string): { email: string; name: string } {
  const match = address.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: '', email: address.trim() };
}

function getFrom(): { email: string; name: string } {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error(
      'Email not configured: set EMAIL_FROM (e.g. "Nelson Ferreira <hello@yourdomain.com>") in .env'
    );
  }
  return parseAddress(from);
}

function getApiKey(): string {
  const key = process.env.SENDER_API_KEY;
  if (!key) {
    throw new Error('Email not configured: set SENDER_API_KEY in .env (get one at sender.net)');
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
  const from = options.from ? parseAddress(options.from) : getFrom();
  const html = options.html ?? options.text.replace(/\n/g, '<br>\n');
  const to = parseAddress(options.to);

  const res = await fetch(SENDER_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: options.subject,
      html,
      text: options.text,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { message?: string }).message || res.statusText || `HTTP ${res.status}`;
    throw new Error(`Sender: ${msg}`);
  }
}

/** Send the same message to many recipients one-by-one to avoid rate limits and track failures. */
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

  for (const recipient of recipients) {
    try {
      const to = parseAddress(recipient);
      const res = await fetch(SENDER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          html: htmlBody,
          text,
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
      errors.push(`${recipient}: ${msg}`);
    }
  }

  return { sent, failed, errors };
}
