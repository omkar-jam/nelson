import 'server-only';
import { getArtworks } from './artworks';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];
const FALLBACK_HERO_VIDEO = 'youtube:nY4LI6zMgxw';

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
  }));
}

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
      galleryVideos: await buildSampleGalleryVideos(),
    };
  }

  if (artworks.length === 0) {
    return {
      heroVideoUrl: FALLBACK_HERO_VIDEO,
      galleryVideos: await buildSampleGalleryVideos(),
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
