import { getHomeArtworkData } from '@/lib/home-artworks';
import { getPublishedPosts } from '@/lib/posts';
import { getAllSettings } from '@/lib/site-settings';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

/** `<link rel="preload">` only applies to direct file URLs; YouTube heroes use an iframe. */
function shouldPreloadHeroVideo(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (u.startsWith('youtube:')) return false;
  const lower = u.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return false;
  return true;
}

function heroIsYouTube(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (u.startsWith('youtube:')) return true;
  const lower = u.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be');
}

/** Unique `https:` origins for preconnect (e.g. R2); skips paths like `/videos/local.mov`. */
function httpsOrigins(...urls: string[]): string[] {
  const set = new Set<string>();
  for (const raw of urls) {
    try {
      const u = new URL(raw.trim());
      if (u.protocol === 'https:') set.add(u.origin);
    } catch {
      // ignore
    }
  }
  return Array.from(set);
}

export default async function HomePage() {
  const [{ heroVideoUrl, heroPosterUrl, galleryVideos }, siteSettings] = await Promise.all([
    getHomeArtworkData(),
    getAllSettings(),
  ]);

  let blogPosts: { id: string; title: string; excerpt: string; slug: string }[] = [];
  try {
    const allPosts = await getPublishedPosts();
    blogPosts = allPosts.slice(0, 2).map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      slug: p.slug,
    }));
  } catch {
    // DB unreachable or Post table missing — show fallback blog section
  }

  const posterTrimmed = heroPosterUrl.trim();
  const youtubeHero = heroIsYouTube(heroVideoUrl || '');
  const assetOrigins = httpsOrigins(heroVideoUrl || '', posterTrimmed);

  return (
    <>
      {assetOrigins.map((origin) => (
        <link key={origin} rel="preconnect" href={origin} crossOrigin="anonymous" />
      ))}
      {youtubeHero ? (
        <>
          <link rel="dns-prefetch" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        </>
      ) : null}
      {posterTrimmed ? (
        <link rel="preload" href={posterTrimmed} as="image" fetchPriority="high" />
      ) : null}
      {shouldPreloadHeroVideo(heroVideoUrl || '') ? (
        <link rel="preload" href={heroVideoUrl} as="video" fetchPriority="high" />
      ) : null}
      <HomeContent
        heroVideoUrl={heroVideoUrl}
        heroPosterUrl={posterTrimmed}
        galleryVideos={galleryVideos}
        blogPosts={blogPosts}
        siteSettings={siteSettings}
      />
    </>
  );
}
