import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2, isR2Configured } from '@/lib/r2';
import { randomUUID } from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execFileAsync = promisify(execFile);

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv', 'm4v']);
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

/** Extensions that support the MP4 faststart flag (moov atom at front). */
const FASTSTART_EXTENSIONS = new Set(['mp4', 'mov', 'm4v']);

function isLikelyVideo(file: File, ext: string): boolean {
  if (file.type.startsWith('video/')) return true;
  return VIDEO_EXTENSIONS.has(ext.toLowerCase());
}

function isLikelyImage(file: File, ext: string): boolean {
  if (file.type.startsWith('image/')) return true;
  return IMAGE_EXTENSIONS.has(ext.toLowerCase());
}

/** `hero` | `hero_poster` | default `artworks` */
function resolveUploadFolder(folderParam: string | null): string {
  if (folderParam === 'hero') return 'hero';
  if (folderParam === 'hero_poster') return 'hero_poster';
  return 'artworks';
}

/**
 * Rewrites the video container so the moov atom sits at the front of the file.
 * This allows browsers to start rendering the first frame immediately on a range
 * request, without buffering the whole file first.
 *
 * - Input .mov files are re-wrapped as .mp4 (same codec, smaller/more compatible container).
 * - Falls back to the original buffer silently if ffmpeg is not available or fails.
 */
async function applyFaststart(
  buffer: Buffer,
  ext: string
): Promise<{ buffer: Buffer; ext: string }> {
  const lowerExt = ext.toLowerCase();
  if (!FASTSTART_EXTENSIONS.has(lowerExt)) return { buffer, ext };

  try {
    await execFileAsync('ffmpeg', ['-version']);
  } catch {
    return { buffer, ext };
  }

  const id = randomUUID();
  const inputPath = join(tmpdir(), `${id}-in.${lowerExt}`);
  const outputPath = join(tmpdir(), `${id}-out.mp4`);

  try {
    await writeFile(inputPath, buffer);
    await execFileAsync('ffmpeg', [
      '-i', inputPath,
      '-c', 'copy',
      '-movflags', '+faststart',
      '-y',
      outputPath,
    ]);
    const processed = await readFile(outputPath);
    return { buffer: processed, ext: 'mp4' };
  } catch {
    return { buffer, ext };
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
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

  const folder = resolveUploadFolder(request.nextUrl.searchParams.get('folder'));

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

  if (folder === 'hero_poster' && !isLikelyImage(file, ext)) {
    return NextResponse.json(
      { error: 'Poster uploads must be an image (.jpg, .png, .webp, …)' },
      { status: 400 }
    );
  }

  let buffer = Buffer.from(await file.arrayBuffer());
  let finalExt = ext;
  let contentType = file.type || 'application/octet-stream';

  if (isLikelyVideo(file, ext)) {
    const result = await applyFaststart(buffer, ext);
    buffer = result.buffer;
    finalExt = result.ext;
    if (finalExt === 'mp4') contentType = 'video/mp4';
  }

  const key = `${folder}/${randomUUID()}.${finalExt}`;
  const url = await uploadToR2(key, buffer, contentType);
  if (!url) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  return NextResponse.json({ url, key });
}
