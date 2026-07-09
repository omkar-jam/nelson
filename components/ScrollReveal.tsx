'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type RevealVariant =
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'scaleRotate'
  | 'blur'
  | 'fade'
  | 'flip';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  variant?: RevealVariant;
  stiffness?: number;
  damping?: number;
}

/**
 * Lightweight reveal — CSS transitions + IntersectionObserver (no Framer).
 * Keeps mobile TBT down while preserving scroll-in motion.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  once = true,
  amount = 0.12,
  variant = 'slideUp',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, once]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: visible ? `${delay}s` : '0s',
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
