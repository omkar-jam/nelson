import { SiteNav } from '@/components/SiteNav';
import { getArtworks } from '@/lib/artworks';
import { ArtworkCard } from '@/components/artwork-card';

/** DB is not available during Docker image build — render on each request instead. */
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen bg-plati-dark pt-24 font-body text-paper sm:pt-28">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 font-display text-display-lg font-light text-paper">Gallery</h1>
        {artworks.length === 0 ? (
          <p className="text-body text-plati-muted">No artworks yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <li key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
