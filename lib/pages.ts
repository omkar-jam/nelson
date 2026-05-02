import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

export const getPageBySlug = unstable_cache(
  async (slug: string) => prisma.page.findUnique({ where: { slug } }),
  ['page-by-slug'],
  { revalidate: 3600, tags: ['pages'] }
);

export async function getAllPages() {
  return prisma.page.findMany({ orderBy: { slug: 'asc' } });
}

export async function upsertPage(slug: string, title: string, content: string) {
  return prisma.page.upsert({
    where: { slug },
    create: { slug, title, content },
    update: { title, content },
  });
}
