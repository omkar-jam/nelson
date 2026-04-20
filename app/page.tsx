import { getHomeArtworkData } from '@/lib/home-artworks';
import { getPublishedPosts } from '@/lib/posts';
import { getAllSettings } from '@/lib/site-settings';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

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
    <HomeContent
      heroVideoUrl={heroVideoUrl}
      galleryVideos={galleryVideos}
      blogPosts={blogPosts}
      siteSettings={siteSettings}
    />
  );
}
