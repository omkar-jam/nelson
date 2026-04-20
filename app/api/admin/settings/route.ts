import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllSettings, setSettings, SETTING_KEYS } from '@/lib/site-settings';
import type { SettingKey } from '@/lib/site-settings';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validKeys = new Set(Object.values(SETTING_KEYS));
  const entries: Partial<Record<SettingKey, string>> = {};
  for (const [key, value] of Object.entries(body)) {
    if (validKeys.has(key as SettingKey) && typeof value === 'string') {
      entries[key as SettingKey] = value;
    }
  }

  if (Object.keys(entries).length === 0) {
    return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 });
  }

  await setSettings(entries);
  return NextResponse.json({ ok: true });
}
