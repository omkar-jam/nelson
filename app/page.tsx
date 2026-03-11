import { getHomeArtworkData } from '@/lib/home-artworks';
import { getPublishedPosts } from '@/lib/posts';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { heroVideoUrl, galleryVideos } = await getHomeArtworkData();
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
    // DB unreachable or Post table missing (e.g. migration not run) — show fallback blog section
  }

  return (
    <HomeContent
      heroVideoUrl={heroVideoUrl}
      galleryVideos={galleryVideos}
      blogPosts={blogPosts}
    />
  );
}
