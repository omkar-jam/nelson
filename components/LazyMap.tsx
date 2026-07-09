'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  embedUrl: string;
  title: string;
  className?: string;
};

/**
 * Defers Google Maps iframe until near the viewport so embed JS does not
 * compete with LCP / main-thread work on initial load.
 */
export function LazyMap({ embedUrl, title, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bg-night-bg ${className}`}>
      {show ? (
        <iframe
          title={title}
          src={embedUrl}
          width="100%"
          height="100%"
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-body text-caption uppercase tracking-widest text-plati-muted">
          Loading map…
        </div>
      )}
    </div>
  );
}
