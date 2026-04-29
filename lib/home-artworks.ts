import 'server-only';
import { getArtworks } from './artworks';
import { getHomeGalleryMediaType } from './gallery-media';
import { getSetting, SETTING_KEYS } from './site-settings';

/** Served from `public/videos/drone-hero.mov` */
const FALLBACK_HERO_VIDEO = '/videos/drone-hero.mov';


export { getHomeGalleryMediaType, isVideoUrl } from './gallery-media';

export type HomeGalleryItem = {
  id: string;
  src: string;
  title: string;
  type: 'video' | 'image' | 'youtube';
  /** Public detail URL for database artworks; null for embedded samples */
  detailPath: string | null;
};

export type HomeArtworkData = {
  heroVideoUrl: string;
  /** Optional poster still until video is ready (empty = browser default). */
  heroPosterUrl: string;
  galleryVideos: HomeGalleryItem[];
};

function hasValidMedia(url: string): boolean {
  if (!url || !url.trim()) return false;
  if (url.startsWith('youtube:')) return url.length > 'youtube:'.length;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function getHomeArtworkData(): Promise<HomeArtworkData> {
  const [heroVideoUrlRaw, heroPosterUrlRaw] = await Promise.all([
    getSetting(SETTING_KEYS.HERO_VIDEO_URL).catch(() => FALLBACK_HERO_VIDEO),
    getSetting(SETTING_KEYS.HERO_VIDEO_POSTER_URL).catch(() => ''),
  ]);
  const heroVideoUrl = heroVideoUrlRaw || FALLBACK_HERO_VIDEO;
  const heroPosterUrl = heroPosterUrlRaw.trim();

  let artworks: Awaited<ReturnType<typeof getArtworks>>;
  try {
    artworks = await getArtworks();
  } catch {
    return { heroVideoUrl, heroPosterUrl, galleryVideos: [] };
  }

  // Only include artworks with a valid media URL
  const validArtworks = artworks.filter((a) => hasValidMedia(a.mediaUrl));

  if (validArtworks.length === 0) {
    return { heroVideoUrl, heroPosterUrl, galleryVideos: [] };
  }

  const galleryVideos: HomeGalleryItem[] = validArtworks.map((a) => ({
    id: a.id,
    src: a.mediaUrl,
    title: a.title,
    type: getHomeGalleryMediaType(a.mediaUrl),
    detailPath: `/works/${a.id}`,
  }));

  return { heroVideoUrl, heroPosterUrl, galleryVideos };
}
