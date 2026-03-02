import Link from 'next/link';
import { getArtworks } from '@/lib/artworks';
import { ArtworkCard } from '@/components/artwork-card';

export const dynamic = 'force-dynamic';

export default async function AdminArtworksPage() {
  const artworks = await getArtworks();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-display-lg font-light text-paper">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
        >
          Add artwork
        </Link>
      </div>
      {artworks.length === 0 ? (
        <p className="text-body text-plati-soft">No artworks yet. Add your first one.</p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <li key={artwork.id} className="group relative">
              <Link href={`/admin/artworks/${artwork.id}`} className="block">
                <ArtworkCard artwork={artwork} />
              </Link>
              <div className="mt-3 flex gap-4">
                <Link
                  href={`/admin/artworks/${artwork.id}/edit`}
                  className="text-body-sm text-plati-soft transition hover:text-gleam"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
