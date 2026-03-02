import 'server-only';
import { prisma } from './prisma';

export type ArtworkCreate = {
  title: string;
  description?: string | null;
  year?: number | null;
  mediaUrl: string;
  thumbUrl?: string | null;
  order?: number;
};

export type ArtworkUpdate = Partial<ArtworkCreate>;

export async function getArtworks() {
  return prisma.artwork.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getArtworkById(id: string) {
  return prisma.artwork.findUnique({ where: { id } });
}

export async function createArtwork(data: ArtworkCreate) {
  return prisma.artwork.create({ data });
}

export async function updateArtwork(id: string, data: ArtworkUpdate) {
  return prisma.artwork.update({ where: { id }, data });
}

export async function deleteArtwork(id: string) {
  return prisma.artwork.delete({ where: { id } });
}
