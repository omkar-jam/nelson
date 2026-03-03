import 'server-only';
import { getArtworks } from './artworks';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];
const FALLBACK_HERO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

/** Sample videos shown when there are no artworks in the DB — so you can see how the Works section looks */
const SAMPLE_GALLERY_VIDEOS: HomeGalleryItem[] = [
  { id: 'sample-1', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Nocturne I', type: 'video' },
  { id: 'sample-2', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'Nocturne II', type: 'video' },
  { id: 'sample-3', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4', title: 'Nocturne III', type: 'video' },
  { id: 'sample-4', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', title: 'Nocturne IV', type: 'video' },
  { id: 'sample-5', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Nocturne V', type: 'video' },
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
