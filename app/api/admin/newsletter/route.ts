import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendBulk } from '@/lib/email';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { subject?: string; text?: string; html?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (!subject || !text) {
    return NextResponse.json(
      { error: 'subject and text are required' },
      { status: 400 }
    );
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { unsubscribed: false },
    select: { email: true },
  });
  const emails = subscribers.map((s) => s.email);

  if (emails.length === 0) {
    return NextResponse.json(
      { error: 'No subscribers to send to' },
      { status: 400 }
    );
  }

  const html = typeof body.html === 'string' ? body.html.trim() : undefined;

  try {
    const result = await sendBulk(emails, subject, text, html || undefined);
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      failed: result.failed,
      total: emails.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (err) {
    console.error('Newsletter send error:', err);
    const message = err instanceof Error ? err.message : 'Failed to send emails';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
