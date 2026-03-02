import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArtworkById } from '@/lib/artworks';
import { ArtworkForm } from '@/components/artwork-form';

export const dynamic = 'force-dynamic';

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <Link href={`/admin/artworks/${id}`} className="mb-6 inline-block text-body-sm text-plati-soft transition hover:text-gleam">
        Back to artwork
      </Link>
      <h1 className="font-display text-display-md font-light text-paper sm:text-display-lg">Edit artwork</h1>
      <ArtworkForm artwork={artwork} />
    </main>
  );
}
