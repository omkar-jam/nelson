'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyAutoplayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Start loading slightly before the element enters the viewport. */
  rootMargin?: string;
}

/**
 * Defers video download until near the viewport. Shows a poster (or dark
 * placeholder) immediately so below-the-fold gallery items don't compete
 * with the hero for bandwidth and main-thread work on initial load.
 */
export function LazyAutoplayVideo({
  src,
  poster,
  className = '',
  rootMargin = '250px 0px',
}: LazyAutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!active || !video) return;

    video.src = src;
    video.load();
    void video.play().catch(() => {});
  }, [active, src]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            active ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : !active ? (
        <div className="absolute inset-0 bg-plati-dark" aria-hidden />
      ) : null}
      {active ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
