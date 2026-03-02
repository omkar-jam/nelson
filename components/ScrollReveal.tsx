'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

export type RevealVariant = 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'scaleRotate' | 'blur' | 'fade' | 'flip';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  variant?: RevealVariant;
  /** Spring stiffness (higher = snappier). Used when variant supports spring. */
  stiffness?: number;
  damping?: number;
}

const variantConfig: Record<RevealVariant, { hidden: Record<string, unknown>; visible: Record<string, unknown>; transition?: object }> = {
  slideUp: {
    hidden: { opacity: 0, y: 56, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -56, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 72, filter: 'blur(6px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness: 70, damping: 22 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -72, filter: 'blur(6px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness: 70, damping: 22 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 90, damping: 18 },
  },
  scaleRotate: {
    hidden: { opacity: 0, scale: 0.88, rotateY: -12 },
    visible: { opacity: 1, scale: 1, rotateY: 0 },
    transition: { type: 'spring', stiffness: 75, damping: 20 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(14px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness: 60, damping: 25 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { type: 'tween', duration: 0.6, ease: 'easeOut' },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -20 },
    visible: { opacity: 1, rotateX: 0 },
    transition: { type: 'spring', stiffness: 70, damping: 22 },
  },
};

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = false,
  amount = 0.15,
  variant = 'slideUp',
  stiffness,
  damping,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const config = variantConfig[variant];
  const baseTransition = config.transition || {};
  const transition =
    typeof baseTransition === 'object' && 'type' in baseTransition && baseTransition.type === 'spring'
      ? { ...baseTransition, ...(stiffness != null && { stiffness }), ...(damping != null && { damping }), delay }
      : { ...baseTransition, delay };

  const variants: Variants = {
    hidden: config.hidden as Variants['hidden'],
    visible: {
      ...config.visible,
      transition,
    } as Variants['visible'],
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      style={{
        transformOrigin: 'center center',
        ...(variant === 'flip' && { perspective: 800, transformStyle: 'preserve-3d' as const }),
      }}
    >
      {children}
    </motion.div>
  );
}
