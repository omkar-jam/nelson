import Link from 'next/link';
import { getArtworks } from '@/lib/artworks';
import { ArtworkCard } from '@/components/artwork-card';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen">
      <nav className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Artist
          </Link>
          <div className="flex gap-6">
            <Link href="/gallery" className="hover:underline">Gallery</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold">Gallery</h1>
        {artworks.length === 0 ? (
          <p className="text-gray-600">No artworks yet.</p>
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
