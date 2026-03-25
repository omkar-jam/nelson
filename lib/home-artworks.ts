import 'server-only';
import { getArtworks } from './artworks';
import { getHomeGalleryMediaType } from './gallery-media';

/** Served from `public/videos/drone-hero.mov` */
const FALLBACK_HERO_VIDEO = '/videos/drone-hero.mov';

/** YouTube video IDs shown in Works when there are no artworks in the DB */
const SAMPLE_YOUTUBE_IDS = [
  'l13V392f7IU',
  'G72EEYOl6kE',
  '8qLAdA3rTis',
  'iCWe46phyrc',
  'YM74h367HkM',
];

async function fetchYouTubeTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return videoId;
    const data = (await res.json()) as { title?: string };
    return data.title ?? videoId;
  } catch {
    return videoId;
  }
}

async function buildSampleGalleryVideos(): Promise<HomeGalleryItem[]> {
  const titles = await Promise.all(SAMPLE_YOUTUBE_IDS.map(fetchYouTubeTitle));
  return SAMPLE_YOUTUBE_IDS.map((id, i) => ({
    id: `yt-${i + 1}`,
    src: `youtube:${id}`,
    title: titles[i],
    type: 'youtube' as const,
    detailPath: null,
  }));
}

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
  const sampleVideos = await buildSampleGalleryVideos();

  let artworks: Awaited<ReturnType<typeof getArtworks>>;
  try {
    artworks = await getArtworks();
  } catch {
    return { heroVideoUrl: FALLBACK_HERO_VIDEO, galleryVideos: sampleVideos };
  }

  // Only include artworks with a valid media URL
  const validArtworks = artworks.filter((a) => hasValidMedia(a.mediaUrl));

  if (validArtworks.length === 0) {
    return { heroVideoUrl: FALLBACK_HERO_VIDEO, galleryVideos: sampleVideos };
  }

  const heroVideoUrl = FALLBACK_HERO_VIDEO;
  const gallerySource = validArtworks;

  const dbItems: HomeGalleryItem[] = gallerySource.map((a) => ({
    id: a.id,
    src: a.mediaUrl,
    title: a.title,
    type: getHomeGalleryMediaType(a.mediaUrl),
    detailPath: `/works/${a.id}`,
  }));

  // Always keep the YouTube sample videos in the gallery alongside DB artworks
  return { heroVideoUrl, galleryVideos: [...dbItems, ...sampleVideos] };
}
