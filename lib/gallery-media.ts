const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];

export function isVideoUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

export function getHomeGalleryMediaType(src: string): 'youtube' | 'video' | 'image' {
  if (src.startsWith('youtube:')) return 'youtube';
  if (isVideoUrl(src)) return 'video';
  return 'image';
}
