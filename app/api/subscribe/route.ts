import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() ?? '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

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

    await prisma.subscriber.upsert({
      where: { email },
      create: { email, unsubscribed: false },
      update: { unsubscribed: false, updatedAt: new Date() },
    });

    const artistEmail = process.env.ARTIST_EMAIL;
    if (artistEmail) {
      try {
        await sendMail({
          to: artistEmail,
          subject: '[Mailing list] New subscriber',
          text: `A new person joined your mailing list:\n\n${email}`,
          html: `<p>A new person joined your mailing list:</p><p><a href="mailto:${email}">${email}</a></p>`,
        });
      } catch (err) {
        console.error('Subscribe: failed to notify artist:', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Subscribe error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
