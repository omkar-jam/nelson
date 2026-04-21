import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const includeUnsubscribed = searchParams.get('all') === 'true';

  const subscribers = await prisma.subscriber.findMany({
    where: includeUnsubscribed ? undefined : { unsubscribed: false },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, phone: true, unsubscribed: true, createdAt: true },
  });

  return NextResponse.json({
    count: subscribers.filter((s) => !s.unsubscribed).length,
    subscribers,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      create: { email, phone, unsubscribed: false },
      update: { phone, unsubscribed: false, updatedAt: new Date() },
    });
    return NextResponse.json({ subscriber });
  } catch {
    return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 });
  }
}
