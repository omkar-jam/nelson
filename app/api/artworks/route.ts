import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getArtworks, createArtwork } from '@/lib/artworks';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const artworks = await getArtworks();
  return NextResponse.json(artworks);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, description, year, mediaUrl, thumbUrl, order } = body;
  if (!title || !mediaUrl) {
    return NextResponse.json(
      { error: 'title and mediaUrl are required' },
      { status: 400 }
    );
  }

  const artwork = await createArtwork({
    title,
    description: description ?? null,
    year: year != null ? Number(year) : null,
    mediaUrl,
    thumbUrl: thumbUrl ?? null,
    order: order != null ? Number(order) : 0,
  });
  return NextResponse.json(artwork);
}
