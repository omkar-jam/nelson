import Image from 'next/image';
import type { Artwork } from '@prisma/client';

type Props = { artwork: Artwork };

export function ArtworkCard({ artwork }: Props) {
  const imageUrl = artwork.thumbUrl || artwork.mediaUrl;

  return (
    <article className="overflow-hidden border border-plati-border bg-plati transition hover:border-gleam/40">
      <div className="relative aspect-[4/3] bg-plati-dark">
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="border-t border-plati-border p-4">
        <h2 className="font-display text-display-sm font-medium text-paper">{artwork.title}</h2>
        {artwork.year && (
          <p className="mt-1 text-body-sm text-plati-muted">{artwork.year}</p>
        )}
        {artwork.description && (
          <p className="mt-2 line-clamp-2 text-body-sm text-plati-soft">
            {artwork.description}
          </p>
        )}
      </div>
    </article>
  );
}
