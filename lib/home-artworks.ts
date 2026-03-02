import 'server-only';
import { getArtworks } from './artworks';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];
const FALLBACK_HERO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

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
  type: 'video' | 'image';
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
    // Database unreachable (e.g. wrong DATABASE_URL or DB not running) — show fallback so the site still loads
    return {
      heroVideoUrl: FALLBACK_HERO_VIDEO,
      galleryVideos: [],
    };
  }

  if (artworks.length === 0) {
    return {
      heroVideoUrl: FALLBACK_HERO_VIDEO,
      galleryVideos: [],
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
