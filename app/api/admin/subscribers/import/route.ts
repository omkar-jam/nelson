import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() ?? '');
}

function parseCSV(text: string): Array<{ email: string; phone: string }> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Detect header row
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('email');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const headers = hasHeader
    ? firstLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    : ['email', 'phone'];

  const emailIdx = headers.findIndex((h) => h === 'email');
  const phoneIdx = headers.findIndex((h) => h.includes('phone'));

  return dataLines
    .map((line) => {
      // Handle quoted CSV fields
      const cols: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          cols.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      cols.push(current.trim());

      const email = (cols[emailIdx] ?? cols[0] ?? '').trim().toLowerCase();
      const phone = phoneIdx >= 0 ? (cols[phoneIdx] ?? '').trim() : (cols[1] ?? '').trim();
      return { email, phone };
    })
    .filter((row) => isValidEmail(row.email));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const contentType = request.headers.get('content-type') ?? '';

  let rows: Array<{ email: string; phone: string }> = [];

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const text = await (file as File).text();
    rows = parseCSV(text);
  } else {
    const body = await request.json().catch(() => null);
    if (Array.isArray(body)) {
      rows = body
        .map((item) => ({
          email: String(item.email ?? '').trim().toLowerCase(),
          phone: String(item.phone ?? '').trim(),
        }))
        .filter((r) => isValidEmail(r.email));
    } else if (typeof body?.csv === 'string') {
      rows = parseCSV(body.csv);
    } else {
      return NextResponse.json({ error: 'Provide a CSV file or JSON array' }, { status: 400 });
    }
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No valid email addresses found in the data' }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      await prisma.subscriber.upsert({
        where: { email: row.email },
        create: { email: row.email, phone: row.phone || null, unsubscribed: false },
        update: {
          ...(row.phone ? { phone: row.phone } : {}),
          unsubscribed: false,
          updatedAt: new Date(),
        },
      });
      imported++;
    } catch (err) {
      skipped++;
      errors.push(`${row.email}: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }

  return NextResponse.json({ imported, skipped, total: rows.length, errors });
}
