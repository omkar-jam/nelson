import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP not configured: set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export type SendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
};

export async function sendMail(options: SendMailOptions): Promise<void> {
  const transporter = getTransporter();
  const from =
    options.from ||
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    'noreply@example.com';

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, '<br>\n'),
  });
}

/** Send the same message to many recipients. Sends one-by-one to avoid rate limits and improve deliverability. */
export async function sendBulk(
  recipients: string[],
  subject: string,
  text: string,
  html?: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const transporter = getTransporter();
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    'noreply@example.com';

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const to of recipients) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html ?? text.replace(/\n/g, '<br>\n'),
      });
      sent++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${to}: ${msg}`);
    }
  }

  return { sent, failed, errors };
}
