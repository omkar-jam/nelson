import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2, isR2Configured } from '@/lib/r2';
import { randomUUID } from 'crypto';

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv', 'm4v']);

function isLikelyVideo(file: File, ext: string): boolean {
  if (file.type.startsWith('video/')) return true;
  return VIDEO_EXTENSIONS.has(ext.toLowerCase());
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: 'Upload not configured (R2 env missing)' },
      { status: 503 }
    );
  }

  const folderParam = request.nextUrl.searchParams.get('folder');
  const folder = folderParam === 'hero' ? 'hero' : 'artworks';

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'bin';

  if (folder === 'hero' && !isLikelyVideo(file, ext)) {
    return NextResponse.json(
      { error: 'Hero uploads must be a video file (.mp4, .mov, .webm, …)' },
      { status: 400 }
    );
  }

  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || 'application/octet-stream';

  const url = await uploadToR2(key, buffer, contentType);
  if (!url) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  return NextResponse.json({ url, key });
}
