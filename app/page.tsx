import { getHomeArtworkData } from '@/lib/home-artworks';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { heroVideoUrl, galleryVideos } = await getHomeArtworkData();

  return (
    <HomeContent
      heroVideoUrl={heroVideoUrl}
      galleryVideos={galleryVideos}
    />
  );
}
