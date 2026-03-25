import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPostById, updatePost, deletePost } from '@/lib/posts';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  let body: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    published?: boolean;
    publishedAt?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const data: Parameters<typeof updatePost>[1] = {};
  if (typeof body.title === 'string') data.title = body.title.trim();
  if (typeof body.slug === 'string')
    data.slug = body.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (typeof body.excerpt === 'string') data.excerpt = body.excerpt.trim();
  if (typeof body.body === 'string') data.body = body.body;
  if (typeof body.published === 'boolean') data.published = body.published;
  if (body.publishedAt === null) data.publishedAt = null;
  else if (typeof body.publishedAt === 'string' && body.publishedAt.trim())
    data.publishedAt = body.publishedAt.trim();
  const post = await updatePost(id, data);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
