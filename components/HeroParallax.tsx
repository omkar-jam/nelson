'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroParallaxProps {
  children: React.ReactNode;
  videoSrc: string;
}

export function HeroParallax({ children, videoSrc }: HeroParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 1.1]);
  const gradientOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.35]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen min-h-[100dvh] flex-col"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ scale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
        />
      </motion.div>
      <div className="absolute inset-0 grain-overlay" aria-hidden />
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-plati-dark to-transparent pointer-events-none"
        style={{ opacity: gradientOpacity }}
        aria-hidden
      />
      {children}
    </section>
  );
}
