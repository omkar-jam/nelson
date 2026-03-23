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

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published?: boolean;
}) {
  const publishedAt = data.published ? new Date() : null;
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
  }
) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt =
    data.published === true && !existing.published
      ? new Date()
      : data.published === false
        ? null
        : existing.publishedAt;
  return prisma.post.update({
    where: { id },
    data: {
      ...data,
      publishedAt,
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
