import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function escapeCSV(value: string | null | undefined): string {
  const str = value ?? '';
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  const subscribers = await prisma.subscriber.findMany({
    where: includeAll ? undefined : { unsubscribed: false },
    orderBy: { createdAt: 'desc' },
    select: { email: true, phone: true, unsubscribed: true, createdAt: true },
  });

  const header = 'email,phone,unsubscribed,joined';
  const rows = subscribers.map(
    (s) =>
      `${escapeCSV(s.email)},${escapeCSV(s.phone)},${s.unsubscribed},${s.createdAt.toISOString()}`
  );
  const csv = [header, ...rows].join('\r\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
