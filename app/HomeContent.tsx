'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { HeroParallax } from '@/components/HeroParallax';

const BLOGS = [
  {
    id: 1,
    title: 'PlatiGleam in Angkor Wat: My Journey Through Light and Shadow',
    excerpt: 'I have always been drawn to the silent, sacred spaces of the world—places where history, spirituality, and architecture converge. This September, I stepped into Angkor Wat to paint for the first time, carrying the vision born from my residency at Borobudur, Indonesia.',
    url: 'https://www.nelson-ferreira.com/blog',
  },
  {
    id: 2,
    title: 'PlatiGleam at Borobudur Temple: A Historic First',
    excerpt: "Standing inside the world's largest Buddhist temple with my PlatiGleam paintings was one of the most humbling and profound moments of my career.",
    url: 'https://www.nelson-ferreira.com/blog',
  },
];

const BIO_INTRO =
  'Nelson Ferreira is a master painter and draughtsman trained in the rigorous 15th-century and 19th-century Academic traditions. He specialises in silverpoint, oil glazing, and the sight-size method, and is widely regarded as one of the foremost practitioners of these historic techniques today.';
const BIO_MORE = [
  'He has been invited twice as visiting lecturer at the National Portrait Gallery (London) to teach Renaissance silverpoint drawing during The Encounter: Drawings by Holbein, Leonardo and Dürer exhibition. He has also taught at the Saatchi Gallery, the Victoria & Albert Museum, and regularly instructs senior artists at Walt Disney Animation Studios. As a visiting professor, he lectures at fine-art faculties worldwide, including recent appointments in Indonesia at Universitas Negeri Jakarta, Universitas Negeri Malang, and the American Corner programme at Universitas Muhammadiyah Malang.',
  'Between 2023 and 2025 Ferreira held critically acclaimed solo exhibitions in Portugal, Italy, the United Kingdom, Saudi Arabia, Nepal, Bangladesh, and Indonesia, collectively attracting more than 300,000 visitors. His monumental PlatiGleam painting, acquired for the permanent collection of the 14th century UNESCO-listed Batalha Monastery in Portugal, has now been viewed by over one million people.',
  'In summer 2025 he made history as the first artist ever granted official permission to exhibit inside the 1,200-year-old Borobudur Temple—the world\'s largest Buddhist temple and Indonesia\'s most visited UNESCO World Heritage site. That same year he completed the first fully documented artistic residency at Angkor Wat, Cambodia. Works from these landmark projects are now on long-term display in the Borobudur Museum.',
];

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  type: 'video' | 'image';
};

type Props = {
  heroVideoUrl: string;
  galleryVideos: GalleryItem[];
};

export function HomeContent({ heroVideoUrl, galleryVideos }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const handleMailingList = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-12 md:py-4"
      >
        <div className="flex min-w-0 flex-col">
          <span className="font-display text-display-sm font-medium tracking-wide text-paper sm:text-display-md">Nelson Ferreira</span>
          <span className="font-body text-caption uppercase tracking-[0.12em] text-plati-soft sm:tracking-[0.15em]">
            Visual Artist · Art Teacher · 15th & 19th century techniques
          </span>
        </div>
        <div className="flex shrink-0 gap-3 sm:gap-6 md:gap-8">
          <a href="#works" className="py-2 font-body text-caption uppercase tracking-widest text-plati-soft transition hover:text-gleam sm:text-body-sm">Artwork</a>
          <a href="#contact" className="py-2 font-body text-caption uppercase tracking-widest text-plati-soft transition hover:text-gleam sm:text-body-sm">Contact</a>
        </div>
      </motion.nav>

      <HeroParallax videoSrc={heroVideoUrl}>
        <div className="relative z-20 mt-auto w-full px-4 pb-5 pt-24 sm:pb-6 sm:px-6 md:pb-8">
          <motion.form
            onSubmit={handleMailingList}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 24, delay: 0.8 }}
            className="mx-auto max-w-sm space-y-1.5"
          >
            <p className="font-body text-body-sm text-plati-soft">Join the mailing list</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="min-h-[36px] flex-1 border border-plati-border bg-plati/90 px-3 py-2 font-body text-body text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
                required
              />
              <button
                type="submit"
                className="min-h-[36px] shrink-0 border border-gleam/60 bg-gleam/10 px-4 py-2 font-body text-caption uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
              >
                {submitted ? 'Joined' : 'Submit'}
              </button>
            </div>
            <p className="font-body text-caption italic leading-tight text-plati-muted">
              Para novidades em português, envie mensagem a pedir lista portuguesa.
            </p>
          </motion.form>
          <motion.a
            href="#works"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 1.2 }}
            className="mt-4 flex flex-col items-center text-plati-muted transition hover:text-gleam"
          >
            <span className="animate-scroll-hint block font-body text-caption uppercase tracking-widest">Scroll</span>
            <span className="mt-0.5 block text-plati-border font-body text-caption">↓</span>
          </motion.a>
        </div>
      </HeroParallax>

      <section id="works" className="relative bg-night-bg py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="blur" className="mb-12 text-center sm:mb-16" delay={0.1}>
            <h2 className="font-display text-display-lg font-light tracking-wide text-cream sm:text-display-xl">Works</h2>
            <p className="mt-2 font-body text-body-lg text-night-soft">Paintings in motion</p>
          </ScrollReveal>
          {galleryVideos.length === 0 ? (
            <p className="text-center font-body text-body text-plati-soft">No works to show yet. Add artworks in admin to display them here.</p>
          ) : (
            <div className="space-y-16 sm:space-y-24 md:space-y-32">
              {galleryVideos.map((item, i) => (
                <ScrollReveal
                  key={item.id}
                  once={false}
                  variant={i % 3 === 0 ? 'slideLeft' : i % 3 === 1 ? 'slideRight' : 'scale'}
                  delay={0.05 * (i % 4)}
                  className="overflow-hidden"
                >
                  <div className="overflow-hidden border border-night-border bg-night-surface">
                    <div className="aspect-video w-full">
                      {item.type === 'video' ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                          src={item.src}
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <p className="border-t border-night-border px-4 py-3 font-body text-body text-night-soft sm:px-6 sm:py-4">{item.title}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative border-t border-night-border bg-night-surface py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="slideUp">
            <h2 className="font-display text-display-md font-light text-gold sm:text-display-lg">Artist Bio</h2>
            <div className="mt-6 space-y-5 font-body text-body-lg text-night-soft sm:mt-8 sm:space-y-6">
              <p>{BIO_INTRO}</p>
              {bioExpanded && BIO_MORE.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <motion.button
              type="button"
              onClick={() => setBioExpanded((e) => !e)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:text-gleam-bright sm:mt-8"
            >
              {bioExpanded ? 'Less' : 'More'}
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative bg-plati-dark py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="fade" className="mb-10 sm:mb-16">
            <h2 className="font-display text-display-md font-light text-paper sm:text-display-lg">Blog</h2>
            <p className="mt-1 font-body text-body-lg text-night-soft sm:mt-2">Exhibitions, residencies and reflections</p>
          </ScrollReveal>
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
            {BLOGS.map((blog, i) => (
              <ScrollReveal key={blog.id} once={false} variant={i === 0 ? 'scaleRotate' : 'flip'} delay={0.08 * i}>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-night-border bg-night-surface transition hover:border-gold/40"
                >
                  <article>
                    <div className="border-b border-night-border p-4 sm:p-6 md:p-8">
                      <h3 className="font-display text-display-sm font-medium text-cream transition group-hover:text-gold sm:text-display-md">{blog.title}</h3>
                      <p className="mt-2 font-body text-body leading-relaxed text-night-soft sm:mt-3">{blog.excerpt}</p>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8">
                      <span className="font-body text-body-sm uppercase tracking-widest text-gold">Read more</span>
                    </div>
                  </article>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative border-t border-night-border bg-night-surface py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="slideDown">
            <h2 className="font-display text-display-md font-light text-cream sm:text-display-lg">Contact</h2>
            <p className="mt-1 font-body text-body-lg text-night-soft sm:mt-2">Inquiries, commissions and collaborations.</p>
            <div className="mt-10 grid gap-10 sm:mt-12 sm:gap-12 md:grid-cols-2">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 sm:gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="min-h-[44px] border border-night-border bg-night-bg px-4 py-3 font-body text-body text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="min-h-[44px] border border-night-border bg-night-bg px-4 py-3 font-body text-body text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="min-h-[120px] resize-none border border-night-border bg-night-bg px-4 py-3 font-body text-body text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="min-h-[44px] w-fit border border-gold bg-gold/10 px-6 py-3 font-body text-body-sm uppercase tracking-widest text-gold transition hover:bg-gold/20 sm:px-8"
                >
                  Send
                </motion.button>
              </form>
              <div className="font-body text-body text-night-soft">
                <p className="font-medium text-cream text-body-lg">Nelson Ferreira</p>
                <p className="mt-2 text-body leading-relaxed">
                  Visual Artist · Art Teacher · 15th & 19th century techniques
                </p>
                <p className="mt-3 text-body">
                  <a href="https://wa.me/447950930301" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">+44 7950 930301</a>
                  <span className="text-night-muted"> (WhatsApp preferred)</span>
                </p>
                <p className="mt-2 font-body text-body-sm text-night-muted">
                  Venues: National Portrait Gallery, Walt Disney, ILM, National Museum of Ancient Art
                </p>
                <p className="mt-4 text-body">
                  <a href="https://www.nelson-ferreira.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.nelson-ferreira.com</a>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-night-border py-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 md:px-12">
          <span className="font-display text-body-sm text-night-muted">Nelson Ferreira</span>
          <span className="font-body text-caption text-night-muted">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
