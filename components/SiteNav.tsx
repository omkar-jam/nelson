'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Artwork', href: '/#works' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
] as const;

function linkIsActive(pathname: string, href: string) {
  if (href === '/blog') return pathname === '/blog' || pathname.startsWith('/blog/');
  if (href.startsWith('/#')) return false;
  return pathname === href;
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-plati-border/40 bg-plati-dark/95 backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-12 md:py-4">
        <Link href="/" className="min-w-0 flex-1 text-left">
          <span className="text-shimmer font-display text-display-sm font-medium tracking-wide sm:text-display-md">
            Nelson Ferreira
          </span>
          <span className="mt-0.5 block truncate font-body text-[0.65rem] uppercase leading-tight tracking-[0.1em] text-plati-soft sm:mt-1 sm:text-caption sm:tracking-[0.15em]">
            Visual Artist · Art Teacher · PlatiGleam
          </span>
        </Link>

        <div className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 sm:flex md:gap-x-6 lg:gap-x-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = linkIsActive(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className={`group relative whitespace-nowrap font-body text-[0.65rem] uppercase tracking-[0.12em] transition-colors sm:text-body-sm sm:tracking-widest ${
                  active ? 'text-gleam' : 'text-plati-soft hover:text-gleam'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gleam/60 transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <motion.button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          whileTap={{ scale: 0.94 }}
        >
          {/* Outer frame — subtle “picture frame” nod */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-sm border border-gleam/20 shadow-[inset_0_0_0_1px_rgba(197,191,180,0.06)]"
            animate={
              menuOpen
                ? { borderColor: 'rgba(212, 196, 168, 0.42)', rotate: 90 }
                : { borderColor: 'rgba(197, 191, 180, 0.22)', rotate: 0 }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-plati-border/50"
            animate={menuOpen ? { opacity: 0.35, scale: 0.92 } : { opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.25 }}
          />
          {/* Corner ticks */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-[7px] text-gleam/25"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M2 10V2h8M30 10V2h-8M2 22v8h8M30 22v8h-8" stroke="currentColor" strokeWidth="0.75" />
          </svg>

          <span className="relative flex h-5 w-[18px] flex-col items-center justify-center gap-[5px]">
            <motion.span
              animate={
                menuOpen
                  ? { rotate: 45, y: 6, backgroundColor: 'rgba(212, 196, 168, 0.95)' }
                  : { rotate: 0, y: 0, backgroundColor: 'rgba(197, 191, 180, 0.85)' }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="block h-px w-[18px] origin-center rounded-full"
            />
            <motion.span
              animate={
                menuOpen
                  ? { opacity: 0, scaleX: 0.2, x: -6 }
                  : { opacity: 1, scaleX: 1, x: 0 }
              }
              transition={{ duration: 0.2 }}
              className="block h-px w-[18px] rounded-full bg-plati-soft"
            />
            <motion.span
              animate={
                menuOpen
                  ? { rotate: -45, y: -6, backgroundColor: 'rgba(212, 196, 168, 0.95)' }
                  : { rotate: 0, y: 0, backgroundColor: 'rgba(197, 191, 180, 0.85)' }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="block h-px w-[18px] origin-center rounded-full"
            />
          </span>
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gleam origin-left"
        style={{ scaleX }}
        aria-hidden
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-t border-plati-border bg-plati-dark/98 backdrop-blur-md sm:hidden"
          >
            <div
              className="flex flex-col px-6 pb-4 pt-2"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            >
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.05,
                    duration: 0.24,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-b border-plati-border/50 py-4 font-body text-body uppercase tracking-widest transition active:text-gleam ${
                      linkIsActive(pathname, href) ? 'text-gleam' : 'text-plati-soft hover:text-gleam'
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
