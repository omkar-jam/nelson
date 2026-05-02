import 'server-only';
import { unstable_cache } from 'next/cache';
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

export const getArtworks = unstable_cache(
  async () =>
    prisma.artwork.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  ['artworks'],
  { revalidate: 300, tags: ['artworks'] }
);

export const getArtworkById = unstable_cache(
  async (id: string) => prisma.artwork.findUnique({ where: { id } }),
  ['artwork-by-id'],
  { revalidate: 300, tags: ['artworks'] }
);

export async function createArtwork(data: ArtworkCreate) {
  return prisma.artwork.create({ data });
}

export async function updateArtwork(id: string, data: ArtworkUpdate) {
  return prisma.artwork.update({ where: { id }, data });
}

export async function deleteArtwork(id: string) {
  return prisma.artwork.delete({ where: { id } });
}
