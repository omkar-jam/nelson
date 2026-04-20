'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const YOUTUBE_PREFIX = 'youtube:';

/** Space below fixed nav on small screens (matches SiteNav block + safe area). */
const MOBILE_NAV_OFFSET_CLASS =
  'pt-[calc(env(safe-area-inset-top)+5.25rem)] md:pt-0';

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
      className={`relative flex w-full flex-col md:min-h-[100dvh] ${MOBILE_NAV_OFFSET_CLASS}`}
    >
      <motion.div
        className="relative z-0 w-full shrink-0 overflow-hidden bg-plati-dark aspect-video md:absolute md:inset-0 md:aspect-auto md:min-h-[100dvh]"
        style={{ scale }}
      >
        {embedUrl ? (
          <div className="absolute inset-0 overflow-hidden bg-plati-dark">
            <iframe
              title="Hero video"
              src={embedUrl}
              className="absolute border-0 max-md:inset-0 max-md:h-full max-md:w-full md:inset-auto md:left-1/2 md:top-1/2 md:h-[56.25vw] md:min-h-[100dvh] md:w-[177.78vh] md:min-w-[100vw] md:-translate-x-1/2 md:-translate-y-1/2"
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
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-plati-dark object-contain object-center md:object-cover"
            src={videoSrc}
          />
        )}
        <div className="pointer-events-none absolute inset-0 grain-overlay" aria-hidden />
        {embedUrl && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-plati-dark to-transparent md:h-28 lg:h-32"
            aria-hidden
          />
        )}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-40 bg-gradient-to-t from-plati-dark to-transparent md:block"
        style={{ opacity: gradientOpacity }}
        aria-hidden
      />
      {children}
    </section>
  );
}
