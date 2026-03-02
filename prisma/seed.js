const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, name: 'Admin', passwordHash },
    update: {},
  });

  console.log('Seeded admin user:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
