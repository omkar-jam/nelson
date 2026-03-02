import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArtworkById } from '@/lib/artworks';
import Image from 'next/image';
import { DeleteArtworkButton } from '@/components/delete-artwork-button';

export const dynamic = 'force-dynamic';

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/admin/artworks" className="text-body-sm text-plati-soft transition hover:text-gleam">
          Back to artworks
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/admin/artworks/${id}/edit`}
            className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
          >
            Edit
          </Link>
          <DeleteArtworkButton artworkId={id} />
        </div>
      </div>
      <div className="relative aspect-video overflow-hidden border border-plati-border bg-plati">
        <Image
          src={artwork.thumbUrl || artwork.mediaUrl}
          alt={artwork.title}
          fill
          className="object-contain"
        />
      </div>
      <h1 className="mt-6 font-display text-display-md font-medium text-paper">{artwork.title}</h1>
      {artwork.year && <p className="mt-1 text-body text-plati-muted">{artwork.year}</p>}
      {artwork.description && (
        <p className="mt-4 text-body text-plati-soft leading-relaxed">{artwork.description}</p>
      )}
    </main>
  );
}
