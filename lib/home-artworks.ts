import 'server-only';
import { getArtworks } from './artworks';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];
const FALLBACK_HERO_VIDEO = 'youtube:nY4LI6zMgxw';

/** YouTube videos shown in Works when there are no artworks in the DB */
const SAMPLE_GALLERY_VIDEOS: HomeGalleryItem[] = [
  { id: 'yt-1', src: 'youtube:l13V392f7IU', title: 'Work 1', type: 'youtube' },
  { id: 'yt-2', src: 'youtube:G72EEYOl6kE', title: 'Work 2', type: 'youtube' },
  { id: 'yt-3', src: 'youtube:8qLAdA3rTis', title: 'Work 3', type: 'youtube' },
  { id: 'yt-4', src: 'youtube:iCWe46phyrc', title: 'Work 4', type: 'youtube' },
  { id: 'yt-5', src: 'youtube:YM74h367HkM', title: 'Work 5', type: 'youtube' },
];

export function isVideoUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

export type HomeGalleryItem = {
  id: string;
  src: string;
  title: string;
  type: 'video' | 'image' | 'youtube';
};

export type HomeArtworkData = {
  heroVideoUrl: string;
  galleryVideos: HomeGalleryItem[];
};

export async function getHomeArtworkData(): Promise<HomeArtworkData> {
  let artworks: Awaited<ReturnType<typeof getArtworks>>;
  try {
    artworks = await getArtworks();
  } catch {
    // Database unreachable — show hero + sample videos so you can see how the Works section looks
    return {
      heroVideoUrl: FALLBACK_HERO_VIDEO,
      galleryVideos: SAMPLE_GALLERY_VIDEOS,
    };
  }

  if (artworks.length === 0) {
    return {
      heroVideoUrl: FALLBACK_HERO_VIDEO,
      galleryVideos: SAMPLE_GALLERY_VIDEOS,
    };
  }

  const first = artworks[0];
  const firstIsVideo = isVideoUrl(first.mediaUrl);

  const heroVideoUrl = firstIsVideo ? first.mediaUrl : FALLBACK_HERO_VIDEO;
  const gallerySource = firstIsVideo ? artworks.slice(1) : artworks;

  const galleryVideos: HomeGalleryItem[] = gallerySource.map((a) => ({
    id: a.id,
    src: a.mediaUrl,
    title: a.title,
    type: isVideoUrl(a.mediaUrl) ? 'video' : 'image',
  }));

  return { heroVideoUrl, galleryVideos };
}
