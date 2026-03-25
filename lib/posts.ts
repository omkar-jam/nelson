import 'server-only';
import { applyBlogClientPatches } from './blog-patches';
import { fixImportedWixBlogHtml } from './blog-html';
import { prisma } from './prisma';

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
  });
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });
  if (!post) return null;
  return { ...post, body: applyBlogClientPatches(post.slug, fixImportedWixBlogHtml(post.body)) };
}

export async function getAllPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

function parsePublishedAtInput(
  value: string | Date | null | undefined
): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return undefined;
  return d;
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published?: boolean;
  publishedAt?: string | Date | null;
}) {
  let publishedAt: Date | null = null;
  if (data.published) {
    const parsed = parsePublishedAtInput(data.publishedAt);
    publishedAt = parsed ?? new Date();
  }
  return prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: data.body,
      published: data.published ?? false,
      publishedAt,
    },
  });
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    published?: boolean;
    publishedAt?: string | Date | null;
  }
) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;

  const { publishedAt: publishedAtInput, ...rest } = data;

  let publishedAt: Date | null | undefined;
  if (data.published === false) {
    publishedAt = null;
  } else if (data.published === true) {
    const parsed = parsePublishedAtInput(publishedAtInput);
    if (parsed !== undefined && parsed !== null) {
      publishedAt = parsed;
    } else if (publishedAtInput === null || publishedAtInput === '') {
      publishedAt = existing.publishedAt ?? new Date();
    } else {
      publishedAt = existing.publishedAt ?? new Date();
    }
  } else if (publishedAtInput !== undefined) {
    const parsed = parsePublishedAtInput(publishedAtInput);
    if (parsed === undefined) {
      publishedAt = undefined;
    } else if (parsed === null) {
      publishedAt = existing.published ? existing.publishedAt : null;
    } else {
      publishedAt = parsed;
    }
  }

  return prisma.post.update({
    where: { id },
    data: {
      ...rest,
      ...(publishedAt !== undefined ? { publishedAt } : {}),
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
