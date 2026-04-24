import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { email, name, phone, unsubscribed } = body;

  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    const data: Record<string, unknown> = { updatedAt: new Date() };
    if (email !== undefined) data.email = email.trim().toLowerCase();
    if (name !== undefined) data.name = name ? String(name).trim() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (unsubscribed !== undefined) data.unsubscribed = Boolean(unsubscribed);

    const subscriber = await prisma.subscriber.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ subscriber });
  } catch {
    return NextResponse.json({ error: 'Subscriber not found or update failed' }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.subscriber.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
  }
}
