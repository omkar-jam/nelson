'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Artwork', href: '/#works' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
] as const;

function linkIsActive(pathname: string, href: string) {
  if (href === '/blog') return pathname === '/blog' || pathname.startsWith('/blog/');
  if (href.startsWith('/#')) return false;
  return pathname === href;
}

/** Lightweight nav — CSS only (no Framer) to keep mobile TBT low. */
export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setScrollProgress(max > 0 ? doc.scrollTop / max : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

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
    <nav
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

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-sm border shadow-[inset_0_0_0_1px_rgba(197,191,180,0.06)] transition-all duration-300 ${
              menuOpen ? 'rotate-90 border-gleam/40' : 'border-gleam/20'
            }`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-[5px] rounded-[2px] border border-plati-border/50 transition-all duration-250 ${
              menuOpen ? 'scale-90 opacity-35' : 'opacity-70'
            }`}
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-[7px] text-gleam/25"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M2 10V2h8M30 10V2h-8M2 22v8h8M30 22v8h-8" stroke="currentColor" strokeWidth="0.75" />
          </svg>

          <span className="relative flex h-5 w-[18px] flex-col items-center justify-center gap-[5px]">
            <span
              className={`block h-px w-[18px] origin-center rounded-full bg-plati-soft transition-transform duration-300 ${
                menuOpen ? 'translate-y-[6px] rotate-45 bg-gleam' : ''
              }`}
            />
            <span
              className={`block h-px w-[18px] rounded-full bg-plati-soft transition-all duration-200 ${
                menuOpen ? 'scale-x-20 -translate-x-1.5 opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px w-[18px] origin-center rounded-full bg-plati-soft transition-transform duration-300 ${
                menuOpen ? '-translate-y-[6px] -rotate-45 bg-gleam' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gleam"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden
      />

      <div
        className={`overflow-hidden border-t border-plati-border bg-plati-dark/98 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out sm:hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div
          className="flex flex-col px-6 pb-4 pt-2"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block border-b border-plati-border/50 py-4 font-body text-body uppercase tracking-widest transition active:text-gleam ${
                linkIsActive(pathname, href) ? 'text-gleam' : 'text-plati-soft hover:text-gleam'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
