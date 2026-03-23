'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const YOUTUBE_PREFIX = 'youtube:';

function getYouTubeId(videoSrc: string): string | null {
  if (videoSrc.startsWith(YOUTUBE_PREFIX)) return videoSrc.slice(YOUTUBE_PREFIX.length);
  try {
    const u = new URL(videoSrc);
    if (u.hostname === 'www.youtube.com' && u.pathname === '/watch' && u.searchParams.has('v')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
  } catch {
    // ignore
  }
  return null;
}

interface HeroParallaxProps {
  children: React.ReactNode;
  videoSrc: string;
}

export function HeroParallax({ children, videoSrc }: HeroParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const youtubeId = getYouTubeId(videoSrc);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 1.1]);
  const gradientOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.35]);

  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`
    : null;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen min-h-[100dvh] flex-col"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ scale }}
      >
        {embedUrl ? (
          <div className="absolute inset-0 overflow-hidden bg-plati-dark">
            {/* Mobile: fit full 16:9 frame (no crop). md+: cover viewport like object-cover. */}
            <iframe
              title="Hero video"
              src={embedUrl}
              className="absolute left-1/2 top-1/2 h-[min(56.25vw,100dvh)] w-[min(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0 md:h-[56.25vw] md:min-h-[100dvh] md:w-[177.78vh] md:min-w-[100vw]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full bg-plati-dark object-contain object-center md:object-cover"
            src={videoSrc}
          />
        )}
      </motion.div>
      <div className="absolute inset-0 grain-overlay" aria-hidden />
      {/* Hide YouTube player title overlay in top strip */}
      {embedUrl && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-plati-dark to-transparent sm:h-32"
          aria-hidden
        />
      )}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-plati-dark to-transparent pointer-events-none"
        style={{ opacity: gradientOpacity }}
        aria-hidden
      />
      {children}
    </section>
  );
}
