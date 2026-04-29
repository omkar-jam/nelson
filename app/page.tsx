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

export default async function HomePage() {
  const [{ heroVideoUrl, galleryVideos }, siteSettings] = await Promise.all([
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

  return (
    <>
      {shouldPreloadHeroVideo(heroVideoUrl || '') ? (
        <link rel="preload" href={heroVideoUrl} as="video" />
      ) : null}
      <HomeContent
        heroVideoUrl={heroVideoUrl}
        galleryVideos={galleryVideos}
        blogPosts={blogPosts}
        siteSettings={siteSettings}
      />
    </>
  );
}
