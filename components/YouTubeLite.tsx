'use client';

import { useState } from 'react';

interface YouTubeLiteProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

/**
 * Renders a YouTube thumbnail that upgrades to a full iframe only after the
 * user clicks play. This avoids loading the heavy YouTube embed JS/CSS on
 * page load and dramatically improves LCP and TTI.
 */
export function YouTubeLite({ videoId, title, className = '', autoplay = true }: YouTubeLiteProps) {
  const [activated, setActivated] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;

  if (activated) {
    return (
      <iframe
        title={title}
        src={embedSrc}
        className={`border-0 ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className={`group relative overflow-hidden bg-black ${className}`}
      onClick={() => setActivated(true)}
      aria-label={`Play video: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      {/* Dark overlay */}
      <span className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" aria-hidden />
      {/* Play button */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16">
          <svg
            className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
