import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2, isR2Configured } from '@/lib/r2';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: 'Upload not configured (R2 env missing)' },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'bin';
  const key = `artworks/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || 'application/octet-stream';

  const url = await uploadToR2(key, buffer, contentType);
  if (!url) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  return NextResponse.json({ url, key });
}
