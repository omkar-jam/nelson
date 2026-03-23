#!/usr/bin/env node
/**
 * One-off: remove duplicate blog rows that share the same title (e.g. empty draft + imported post).
 * Keeps the row with the longest body. Dry-run by default — pass --apply to delete.
 *
 * Usage: node scripts/dedupe-blog-posts-by-title.mjs
 *        node scripts/dedupe-blog-posts-by-title.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, body: true },
  });
  const byTitle = new Map();
  for (const p of posts) {
    const k = p.title.trim().toLowerCase();
    if (!byTitle.has(k)) byTitle.set(k, []);
    byTitle.get(k).push(p);
  }
  let removed = 0;
  for (const [title, list] of byTitle) {
    if (list.length < 2) continue;
    list.sort((a, b) => b.body.length - a.body.length);
    const keep = list[0];
    for (const dup of list.slice(1)) {
      const short =
        dup.body.length < 400 ||
        dup.body.length < Math.min(keep.body.length * 0.4, keep.body.length - 500);
      if (!short) {
        console.warn('Skip (ambiguous length):', dup.slug, dup.body.length, 'vs', keep.slug, keep.body.length);
        continue;
      }
      console.log(`${apply ? 'DELETE' : 'would delete'}`, dup.slug, `(${dup.body.length} chars) — keep`, keep.slug);
      if (apply) {
        await prisma.post.delete({ where: { id: dup.id } });
      }
      removed++;
    }
  }
  console.log(apply ? `Removed ${removed} duplicate(s).` : `Dry run: ${removed} duplicate(s). Use --apply to delete.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
