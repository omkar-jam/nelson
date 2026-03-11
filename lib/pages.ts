import 'server-only';
import { prisma } from './prisma';

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

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
