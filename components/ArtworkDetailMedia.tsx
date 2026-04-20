import { getHomeGalleryMediaType } from '@/lib/gallery-media';

type Props = {
  mediaUrl: string;
  title: string;
};

export function ArtworkDetailMedia({ mediaUrl, title }: Props) {
  const type = getHomeGalleryMediaType(mediaUrl);
  const youtubeId = mediaUrl.replace(/^youtube:/, '');

  if (type === 'youtube') {
    return (
      <div className="aspect-video w-full overflow-hidden border border-night-border bg-black">
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="aspect-video w-full overflow-hidden border border-night-border bg-black">
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden border border-night-border bg-night-surface">
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-supplied arbitrary URLs */}
      <img src={mediaUrl} alt={title} className="mx-auto max-h-[min(80vh,900px)] w-full object-contain" />
    </div>
  );
}
