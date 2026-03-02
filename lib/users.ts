import 'server-only';
import { prisma } from './prisma';

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  name?: string | null;
  passwordHash: string;
}) {
  return prisma.user.create({ data });
}
