'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

function isNarrowViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(max-width: 767px)').matches;
}

interface HeroParallaxProps {
  children: React.ReactNode;
  videoSrc: string;
  /** Shown until video frames are ready; also behind YouTube iframe until it loads. */
  posterSrc?: string;
}

/** Hero media — no Framer (keeps mobile TBT low). Poster is LCP via next/image. */
export function HeroParallax({ children, videoSrc, posterSrc }: HeroParallaxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [youtubeFrameLoaded, setYoutubeFrameLoaded] = useState(false);
  const [directVideoReady, setDirectVideoReady] = useState(false);
  const [loadDirectVideo, setLoadDirectVideo] = useState(false);
  const youtubeId = getYouTubeId(videoSrc);

  const poster = posterSrc?.trim() || undefined;

  useEffect(() => {
    setYoutubeFrameLoaded(false);
    setDirectVideoReady(false);
    setLoadDirectVideo(false);
  }, [videoSrc]);

  /**
   * Defer hero MP4 so the poster can be LCP.
   * On mobile: wait for gesture / long timeout (video is multi-MB).
   * On desktop: load after short idle.
   */
  useEffect(() => {
    if (youtubeId || !videoSrc.trim()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setLoadDirectVideo(true);
    };

    const narrow = isNarrowViewport();

    if (narrow) {
      const onInteract = () => start();
      window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
      window.addEventListener('scroll', onInteract, { once: true, passive: true });
      const timer = window.setTimeout(start, 8000);
      return () => {
        cancelled = true;
        window.removeEventListener('pointerdown', onInteract);
        window.removeEventListener('scroll', onInteract);
        window.clearTimeout(timer);
      };
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(start, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [youtubeId, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!loadDirectVideo || !video || !videoSrc.trim()) return;

    video.src = videoSrc;
    video.load();
    void video.play().catch(() => {});
  }, [loadDirectVideo, videoSrc]);

  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`
    : null;

  const iframeFadeClass =
    poster && embedUrl
      ? `transition-opacity duration-700 ${youtubeFrameLoaded ? 'opacity-100' : 'opacity-0'}`
      : '';

  const posterImage = poster ? (
    <Image
      src={poster}
      alt=""
      aria-hidden
      fill
      priority
      sizes="100vw"
      quality={70}
      className={`object-contain object-center transition-opacity duration-700 md:object-cover ${
        embedUrl
          ? youtubeFrameLoaded
            ? 'opacity-0'
            : 'opacity-100'
          : directVideoReady
            ? 'opacity-0'
            : 'opacity-100'
      }`}
    />
  ) : null;

  return (
    <section className={`relative flex w-full flex-col md:min-h-[100dvh] ${MOBILE_NAV_OFFSET_CLASS}`}>
      <div className="relative z-0 w-full shrink-0 overflow-hidden bg-plati-dark aspect-video md:absolute md:inset-0 md:aspect-auto md:min-h-[100dvh]">
        {embedUrl ? (
          <div className="absolute inset-0 overflow-hidden bg-plati-dark">
            {posterImage}
            <iframe
              title="Hero video"
              src={embedUrl}
              onLoad={() => setYoutubeFrameLoaded(true)}
              className={`absolute border-0 max-md:inset-0 max-md:h-full max-md:w-full md:inset-auto md:left-1/2 md:top-1/2 md:h-[56.25vw] md:min-h-[100dvh] md:w-[177.78vh] md:min-w-[100vw] md:-translate-x-1/2 md:-translate-y-1/2 ${iframeFadeClass}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {posterImage}
            {loadDirectVideo ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster={poster}
                onCanPlay={() => setDirectVideoReady(true)}
                className={`absolute inset-0 h-full w-full bg-plati-dark object-contain object-center transition-opacity duration-700 md:object-cover ${
                  directVideoReady || !poster ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null}
          </>
        )}
        <div className="pointer-events-none absolute inset-0 grain-overlay" aria-hidden />
        {embedUrl && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-plati-dark to-transparent md:h-28 lg:h-32"
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-40 bg-gradient-to-t from-plati-dark to-transparent md:block"
          aria-hidden
        />
      </div>
      {children}
    </section>
  );
}
