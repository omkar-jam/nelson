import { getHomeArtworkData } from '@/lib/home-artworks';
import { getPublishedPosts } from '@/lib/posts';
import { getAllSettings } from '@/lib/site-settings';
import { HomeContent } from './HomeContent';

/** ISR: avoid force-dynamic so HTML can be cached at the edge (helps TTFB). */
export const revalidate = 60;

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
      {/* Poster preload is handled by next/image `priority` in HeroParallax
          (optimized AVIF/WebP). Do not preload the raw R2 PNG — it is ~1.2MB. */}
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
