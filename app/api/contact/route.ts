import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() ?? '');
}

const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 200;
const MAX_SUBJECT_LENGTH = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME_LENGTH) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, MAX_SUBJECT_LENGTH) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const artistEmail = process.env.ARTIST_EMAIL;
    if (!artistEmail) {
      console.error('Contact form: ARTIST_EMAIL not set in environment (e.g. on Render: Environment → add ARTIST_EMAIL)');
      return NextResponse.json(
        { error: 'Contact form is not configured (ARTIST_EMAIL missing). Please email directly using the link above.' },
        { status: 503 }
      );
    }

    try {
      const emailSubject = subject
        ? `[Contact] ${subject}`
        : `[Contact] Message from ${name || email}`;
      const text = [
        `From: ${name || '(no name)'} <${email}>`,
        subject ? `Subject: ${subject}` : null,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n');
      const html = [
        `<p><strong>From:</strong> ${escapeHtml(name || '(no name)')} &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;</p>`,
        subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : '',
        '<hr/>',
        `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>`,
      ]
        .filter(Boolean)
        .join('\n');

      await sendMail({
        to: artistEmail,
        subject: emailSubject,
        text,
        html,
      });

      // Confirmation email to the person who submitted
      const confirmText = `Hi${name ? ` ${name}` : ''},\n\nThanks for getting in touch. I'll text you when I receive your message.\n\nBest,\nNelson Ferreira`;
      const confirmHtml = `<p>Hi${name ? ` ${escapeHtml(name)}` : ''},</p><p>Thanks for getting in touch. I'll text you when I receive your message.</p><p>Best,<br>Nelson Ferreira</p>`;
      await sendMail({
        to: email,
        subject: "I've received your message — Nelson Ferreira",
        text: confirmText,
        html: confirmHtml,
      });
    } catch (err) {
      console.error('Contact form: failed to send notification email:', err);
      return NextResponse.json(
        { error: 'Could not send your message. Please try emailing directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact form error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
