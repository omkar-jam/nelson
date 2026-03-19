const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const IMPORTED_POSTS_PATH = path.join(__dirname, 'data', 'imported-posts.json');

function loadImportedPosts() {
  if (!fs.existsSync(IMPORTED_POSTS_PATH)) {
    console.warn(
      'No prisma/data/imported-posts.json — run: node scripts/import-wix-blog.mjs (needs network)'
    );
    return [];
  }
  const raw = fs.readFileSync(IMPORTED_POSTS_PATH, 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data.posts) ? data.posts : [];
}

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, name: 'Admin', passwordHash },
    update: {},
  });

  const posts = loadImportedPosts();

  for (const post of posts) {
    const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null;
    await prisma.post.upsert({
      where: { slug: post.slug },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        body: post.body || '',
        published: true,
        publishedAt,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt || '',
        body: post.body || '',
        published: true,
        publishedAt,
      },
    });
  }

  console.log('Seeded admin user:', email);
  console.log('Seeded posts:', posts.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
