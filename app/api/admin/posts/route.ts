import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllPostsForAdmin, createPost } from '@/lib/posts';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const posts = await getAllPostsForAdmin();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: { title?: string; slug?: string; excerpt?: string; body?: string; published?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const slug =
    typeof body.slug === 'string'
      ? body.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'post';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const bodyContent = typeof body.body === 'string' ? body.body : '';
  const published = !!body.published;
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
  const post = await createPost({ title, slug, excerpt, body: bodyContent, published });
  return NextResponse.json(post);
}
