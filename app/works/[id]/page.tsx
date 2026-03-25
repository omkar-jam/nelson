import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArtworkDetailMedia } from '@/components/ArtworkDetailMedia';
import { SiteNav } from '@/components/SiteNav';
import { getArtworkById } from '@/lib/artworks';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) return { title: 'Work' };
  return { title: `${artwork.title} — Nelson Ferreira` };
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) notFound();

  return (
    <main className="min-h-screen bg-night-bg pt-24 font-body text-cream sm:pt-28">
      <SiteNav />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-12 md:py-16">
        <Link
          href="/#works"
          className="text-body-sm text-night-soft transition hover:text-gleam"
        >
          ← Works
        </Link>
        <h1 className="mt-6 font-display text-display-md font-light text-cream sm:text-display-lg">
          {artwork.title}
        </h1>
        {artwork.year != null && (
          <p className="mt-2 font-body text-body text-plati-muted">{artwork.year}</p>
        )}
        <div className="mt-10">
          <ArtworkDetailMedia mediaUrl={artwork.mediaUrl} title={artwork.title} />
        </div>
        {artwork.description?.trim() ? (
          <p className="mt-10 whitespace-pre-wrap font-body text-body leading-relaxed text-night-soft">
            {artwork.description}
          </p>
        ) : null}
      </article>
    </main>
  );
}
