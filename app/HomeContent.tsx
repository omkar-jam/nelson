'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { HeroParallax } from '@/components/HeroParallax';
import { SiteNav } from '@/components/SiteNav';

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

const CONTACT_INTRO =
  'For any inquiries about art courses, commission requests or studio visits, please drop me a message today and join my mailing list - about 5 emails yearly. Please allow me a few days to return to you.';

const STUDIO = {
  name: 'Spitalfields Studio',
  address: '7-15 Greatorex Street',
  city: 'London',
  postcode: 'E15NF',
  mapsEmbedUrl: 'https://www.google.com/maps?q=7-15+Greatorex+Street+London+E15NF&output=embed',
  directionsUrl: 'https://www.google.com/maps/dir//7-15+Greatorex+Street,+London+E15NF',
};
const CONTACT_EMAIL = 'nelson.ferreira.uk@gmail.com';
const CONTACT_PHONE = '+447950930301';

const PHONE_COUNTRY_CODES = [
  { value: '+44', label: '+44 UK' },
  { value: '+1', label: '+1 US/CA' },
  { value: '+91', label: '+91 India' },
  { value: '+353', label: '+353 Ireland' },
  { value: '+351', label: '+351 Portugal' },
  { value: '+33', label: '+33 France' },
  { value: '+49', label: '+49 Germany' },
  { value: '+39', label: '+39 Italy' },
  { value: '+34', label: '+34 Spain' },
  { value: '+61', label: '+61 Australia' },
  { value: '+64', label: '+64 NZ' },
  { value: '+81', label: '+81 Japan' },
  { value: '+86', label: '+86 China' },
  { value: '+55', label: '+55 Brazil' },
  { value: '+27', label: '+27 South Africa' },
  { value: '+31', label: '+31 Netherlands' },
  { value: '+32', label: '+32 Belgium' },
  { value: '+41', label: '+41 Switzerland' },
  { value: '+43', label: '+43 Austria' },
  { value: '+46', label: '+46 Sweden' },
  { value: '+47', label: '+47 Norway' },
  { value: '+45', label: '+45 Denmark' },
  { value: '+48', label: '+48 Poland' },
  { value: '+358', label: '+358 Finland' },
  { value: '+971', label: '+971 UAE' },
  { value: '+966', label: '+966 Saudi Arabia' },
  { value: '+62', label: '+62 Indonesia' },
  { value: '+65', label: '+65 Singapore' },
  { value: '+60', label: '+60 Malaysia' },
  { value: '+66', label: '+66 Thailand' },
  { value: '+84', label: '+84 Vietnam' },
  { value: '+63', label: '+63 Philippines' },
  { value: '+92', label: '+92 Pakistan' },
  { value: '+88', label: '+88 Bangladesh' },
  { value: '+977', label: '+977 Nepal' },
];

const SOCIAL = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nelson-ferreira-visual-artist/', icon: 'linkedin' },
  { name: 'Instagram', href: 'https://www.instagram.com/nelson.ferreira.visual.artist/?hl=pt', icon: 'instagram' },
  { name: 'YouTube', href: 'https://www.youtube.com/@nelsonferreirauk', icon: 'youtube' },
  { name: 'Facebook', href: 'https://www.facebook.com/nelson.ferreira.art.classes.drawing.painting/', icon: 'facebook' },
];

/** Add YouTube video IDs from https://www.youtube.com/@nelsonferreirauk (from each video’s watch?v=ID) */
const FEATURED_YOUTUBE_VIDEOS: { id: string; title: string }[] = [];
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@nelsonferreirauk';

const ACHIEVEMENTS = [
  { value: '1M+', label: 'Viewers at Batalha Monastery' },
  { value: '300K+', label: 'Exhibition Visitors 2023–25' },
  { value: '2×', label: 'National Portrait Gallery Lecturer' },
  { value: '7+', label: 'Countries — Solo Exhibitions' },
  { value: '15C', label: 'Academic Tradition' },
  { value: '1st', label: 'Artist Ever at Borobudur Temple' },
  { value: 'UNESCO', label: 'World Heritage Sites Exhibited' },
  { value: 'Walt Disney', label: 'Animation Studios — Senior Instructor' },
];

const BIO_STATS = [
  { value: '1M+', label: 'Batalha viewers' },
  { value: '300K+', label: 'Exhibition visitors' },
  { value: '2×', label: 'NPG lecturer' },
  { value: '7+', label: 'Solo show countries' },
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
  type: 'video' | 'image' | 'youtube';
};

export type BlogPostPreview = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
};

type Props = {
  heroVideoUrl: string;
  galleryVideos: GalleryItem[];
  blogPosts?: BlogPostPreview[];
};

export function HomeContent({ heroVideoUrl, galleryVideos, blogPosts }: Props) {
  const blogsToShow = (blogPosts && blogPosts.length > 0)
    ? blogPosts.map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt, url: `/blog/${p.slug}` }))
    : BLOGS;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleMailingList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          countryCode: countryCode || '+44',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          subject: contactSubject.trim(),
          message: contactMessage.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setContactError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch {
      setContactError('Something went wrong. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <SiteNav />

      <HeroParallax videoSrc={heroVideoUrl}>
        <div className="relative z-20 mt-auto w-full px-4 pb-5 pt-24 sm:pt-28 sm:pb-6 sm:px-6 md:pb-8" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          <motion.form
            onSubmit={handleMailingList}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 24, delay: 0.8 }}
            className="mx-auto max-w-sm space-y-1.5"
          >
            {submitted ? (
              <>
                <p className="font-body text-body-sm text-gleam">You&apos;re on the list.</p>
                <p className="font-body text-caption leading-snug text-plati-muted">
                  Updates on upcoming projects &amp; art insights. Private — unsubscribe anytime.
                </p>
              </>
            ) : (
              <>
                <p className="font-body text-body-sm text-plati-soft">Join the mailing list</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="min-h-[44px] w-full rounded-none border border-plati-border bg-plati/90 px-3 py-2.5 font-body text-base text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
                  required
                />
                <div className="flex flex-col overflow-hidden rounded-none border border-plati-border bg-plati/90 focus-within:border-gleam sm:flex-row sm:flex-nowrap">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-[44px] w-full min-w-0 cursor-pointer border-0 border-b border-plati-border bg-transparent py-0 pl-3 pr-8 text-left font-body text-base text-paper focus:border-gleam focus:outline-none focus:ring-0 sm:w-auto sm:min-w-[12rem] sm:max-w-[min(100%,14rem)] sm:shrink-0 sm:border-b-0 sm:border-r sm:pr-3 md:min-w-[13.5rem] [&>option]:bg-plati-dark [&>option]:text-paper"
                    aria-label="Country code"
                  >
                    {PHONE_COUNTRY_CODES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile number"
                    className="min-h-[44px] min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 font-body text-base text-paper placeholder:text-plati-muted focus:border-0 focus:outline-none focus:ring-0"
                    autoComplete="tel"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(197,191,180,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  className="touch-target w-full border border-gleam/60 bg-gleam/10 px-4 py-2.5 font-body text-sm uppercase tracking-widest text-gleam transition disabled:opacity-60 sm:w-auto"
                >
                  {loading ? '…' : 'Submit'}
                </motion.button>
                {error && (
                  <p className="font-body text-caption text-red-400">{error}</p>
                )}
                <p className="font-body text-caption leading-snug text-plati-muted">
                  Updates on upcoming projects &amp; art insights. Private — unsubscribe anytime.
                </p>
              </>
            )}
          </motion.form>
          <motion.a
            href="#works"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 1.2 }}
            className="mt-6 flex flex-col items-center gap-2 text-plati-muted transition hover:text-gleam"
          >
            <span className="font-body text-caption uppercase tracking-[0.18em]">Scroll</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="block"
            >
              <svg width="18" height="28" viewBox="0 0 18 28" fill="none" className="text-gleam/40" aria-hidden>
                <path d="M9 0 L9 24" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M2 16 L9 24 L16 16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.span>
          </motion.a>
        </div>
      </HeroParallax>

      {/* Achievements Marquee */}
      <div className="overflow-hidden border-y border-night-border bg-plati/60 py-3 sm:py-4">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
          className="flex items-center whitespace-nowrap will-change-transform"
        >
          {[...ACHIEVEMENTS, ...ACHIEVEMENTS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-6 sm:px-10">
              <span className="font-display text-display-sm text-gleam tracking-wide">{item.value}</span>
              <span className="font-body text-caption uppercase tracking-[0.14em] text-plati-muted">{item.label}</span>
              <span className="ml-6 text-night-border select-none" aria-hidden>·</span>
            </span>
          ))}
        </motion.div>
      </div>

      <section id="works" className="relative bg-night-bg py-12 sm:py-24 md:py-32">
        <div aria-hidden className="pointer-events-none absolute right-4 top-4 select-none font-display text-[7rem] leading-none text-plati-border/20 sm:right-8 sm:top-8 sm:text-[11rem]">01</div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="blur" className="mb-8 text-center sm:mb-16" delay={0.1}>
            <h2 className="font-display text-display-lg font-light tracking-wide text-cream sm:text-display-xl">Works</h2>
            <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-gleam/50 to-transparent" />
            <p className="mt-3 font-body text-body text-night-soft sm:text-body-lg">Paintings in motion</p>
          </ScrollReveal>
          {galleryVideos.length === 0 ? (
            <p className="text-center font-body text-body text-plati-soft">No works to show yet. Add artworks in admin to display them here.</p>
          ) : (
            <div className="space-y-10 sm:space-y-24 md:space-y-32">
              {galleryVideos.map((item, i) => (
                <ScrollReveal
                  key={item.id}
                  once={false}
                  variant={i % 3 === 0 ? 'slideLeft' : i % 3 === 1 ? 'slideRight' : 'scale'}
                  delay={0.05 * (i % 4)}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="group overflow-hidden border border-night-border bg-night-surface transition-colors duration-500 hover:border-gleam/30"
                    whileHover={{ boxShadow: '0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,191,180,0.12)' }}
                  >
                    <div className="aspect-video w-full min-h-[180px] overflow-hidden">
                      <motion.div
                        className="h-full w-full"
                        whileHover={item.type === 'image' ? { scale: 1.04 } : undefined}
                        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        {item.type === 'youtube' ? (
                          <iframe
                            title={item.title}
                            src={`https://www.youtube.com/embed/${item.src.replace(/^youtube:/, '')}?autoplay=1&mute=1&loop=1&playlist=${item.src.replace(/^youtube:/, '')}&rel=0&modestbranding=1`}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : item.type === 'video' ? (
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
                            loading="lazy"
                          />
                        )}
                      </motion.div>
                    </div>
                    <div className="flex items-center justify-between border-t border-night-border px-4 py-3 sm:px-6 sm:py-4">
                      <p className="font-body text-body text-night-soft line-clamp-2 transition-colors duration-300 group-hover:text-gleam">{item.title}</p>
                      <motion.span
                        className="ml-4 shrink-0 text-gleam/0 transition-all duration-300 group-hover:text-gleam/60"
                        aria-hidden
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.span>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
          {/* Featured videos from YouTube channel */}
          <div className="mt-16 sm:mt-24">
            <ScrollReveal once={false} variant="fade" className="text-center">
              <h3 className="font-display text-display-sm font-light text-gleam sm:text-display-md">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gleam-bright"
                >
                  From the channel
                </a>
              </h3>
              <p className="mt-1 font-body text-body text-night-soft">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gleam"
                >
                  Watch more on YouTube
                </a>
              </p>
              {FEATURED_YOUTUBE_VIDEOS.length > 0 ? (
                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:gap-10">
                  {FEATURED_YOUTUBE_VIDEOS.map((video) => (
                    <div key={video.id} className="overflow-hidden border border-night-border bg-night-surface">
                      <div className="aspect-video w-full">
                        <iframe
                          title={video.title}
                          src={`https://www.youtube.com/embed/${video.id}?loop=1&playlist=${video.id}&rel=0`}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <p className="border-t border-night-border px-4 py-3 font-body text-body text-night-soft sm:px-6 sm:py-4">{video.title}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <motion.a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 inline-flex items-center gap-2 font-body text-body-sm uppercase tracking-widest text-gold transition hover:text-gleam-bright"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube channel
              </motion.a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative border-t border-night-border bg-night-surface py-12 sm:py-24 md:py-32">
        <div aria-hidden className="pointer-events-none absolute right-4 top-4 select-none font-display text-[7rem] leading-none text-plati-border/20 sm:right-8 sm:top-8 sm:text-[11rem]">02</div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="slideUp">
            <h2 className="font-display text-display-md font-light text-gold sm:text-display-lg">Artist Bio</h2>
            <div className="mt-1 h-px w-10 bg-gradient-to-r from-gold/50 to-transparent" />
          </ScrollReveal>

          <ScrollReveal once={false} variant="fade" delay={0.15}>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:mt-12 sm:grid-cols-4 sm:gap-8">
              {BIO_STATS.map(({ value, label }) => (
                <div key={label} className="border-t border-gleam/20 pt-4">
                  <p className="font-display text-display-md text-gleam sm:text-display-lg">{value}</p>
                  <p className="mt-1 font-body text-caption uppercase tracking-widest text-plati-muted">{label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal once={false} variant="slideUp" delay={0.2}>
            <div className="mt-8 space-y-4 font-body text-body text-night-soft sm:mt-10 sm:text-body-lg sm:space-y-6">
              <p>{BIO_INTRO}</p>
              <AnimatePresence>
                {bioExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden space-y-4 sm:space-y-6"
                  >
                    {BIO_MORE.map((para, i) => <p key={i}>{para}</p>)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              type="button"
              onClick={() => setBioExpanded((e) => !e)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="touch-target mt-6 inline-flex items-center gap-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:text-gleam-bright sm:mt-8"
            >
              {bioExpanded ? 'Read less' : 'Read more'}
              <motion.span
                animate={{ rotate: bioExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.span>
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative bg-plati-dark py-12 sm:py-24 md:py-32">
        <div aria-hidden className="pointer-events-none absolute right-4 top-4 select-none font-display text-[7rem] leading-none text-plati-border/20 sm:right-8 sm:top-8 sm:text-[11rem]">03</div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="fade" className="mb-8 sm:mb-16">
            <h2 className="font-display text-display-md font-light text-paper sm:text-display-lg">Blog</h2>
            <div className="mt-1 h-px w-10 bg-gradient-to-r from-gleam/50 to-transparent" />
            <p className="mt-3 font-body text-body text-night-soft sm:text-body-lg">Exhibitions, residencies and reflections</p>
          </ScrollReveal>
          <div className="grid gap-6 sm:gap-12 md:grid-cols-2">
            {blogsToShow.map((blog, i) => (
              <ScrollReveal key={blog.id} once={false} variant={i === 0 ? 'scaleRotate' : 'flip'} delay={0.08 * i}>
                <motion.a
                  href={blog.url}
                  {...(blog.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group block min-h-[44px] border border-night-border bg-night-surface"
                  whileHover={{ boxShadow: '0 4px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(197,191,180,0.15)', borderColor: 'rgba(197,191,180,0.25)' }}
                  transition={{ duration: 0.3 }}
                >
                  <article>
                    <div className="relative overflow-hidden border-b border-night-border p-4 sm:p-6 md:p-8">
                      <motion.div
                        className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-gleam/60 via-gleam/20 to-transparent"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                      <h3 className="font-display text-display-sm font-medium text-cream transition-colors duration-300 group-hover:text-gold sm:text-display-md line-clamp-3">{blog.title}</h3>
                      <p className="mt-2 font-body text-body leading-relaxed text-night-soft line-clamp-4 sm:mt-3 sm:line-clamp-none">{blog.excerpt}</p>
                    </div>
                    <div className="flex min-h-[44px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8">
                      <span className="font-body text-body-sm uppercase tracking-widest text-gold">Read more</span>
                      <motion.span
                        className="text-gold/40"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.25 }}
                        aria-hidden
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.span>
                    </div>
                  </article>
                </motion.a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative border-t border-night-border bg-night-surface py-12 sm:py-24 md:py-32">
        <div aria-hidden className="pointer-events-none absolute right-4 top-4 select-none font-display text-[7rem] leading-none text-plati-border/20 sm:right-8 sm:top-8 sm:text-[11rem]">04</div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <ScrollReveal once={false} variant="slideDown">
            <h2 className="font-display text-display-md font-light text-cream sm:text-display-lg">Contact me</h2>
            <div className="mt-1 h-px w-10 bg-gradient-to-r from-gleam/50 to-transparent" />
            <p className="mt-3 max-w-2xl font-body text-body leading-relaxed text-night-soft sm:text-body-lg">
              {CONTACT_INTRO}
            </p>
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Map */}
              <div className="order-2 h-[280px] overflow-hidden border border-night-border sm:h-[320px] lg:order-1 lg:h-[400px]">
                <iframe
                  title="Studio location: 7-15 Greatorex Street, London"
                  src={STUDIO.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Contact details + form */}
              <div className="order-1 flex flex-col gap-8 lg:order-2">
                <div className="font-body text-body text-night-soft">
                  <p className="font-medium text-cream sm:text-body-lg">{STUDIO.name}</p>
                  <p className="mt-1">
                    <a
                      href={STUDIO.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      {STUDIO.address}, {STUDIO.city} {STUDIO.postcode}
                    </a>
                  </p>
                  <p className="mt-3">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">{CONTACT_EMAIL}</a>
                  </p>
                  <p className="mt-2">
                    <a href={`https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      {CONTACT_PHONE}
                    </a>
                    <span className="text-night-muted"> (WhatsApp preferred)</span>
                  </p>
                  <div className="mt-4 flex gap-4">
                    {SOCIAL.map(({ name, href, icon }) => (
                      <motion.a
                        key={icon}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target flex items-center justify-center text-night-soft transition hover:text-gold"
                        aria-label={name}
                        whileHover={{ scale: 1.15, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {icon === 'linkedin' && (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        )}
                        {icon === 'instagram' && (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        )}
                        {icon === 'youtube' && (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        )}
                        {icon === 'facebook' && (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </div>
                <form
                  onSubmit={handleContactSubmit}
                  className="flex flex-col gap-3 sm:gap-4"
                >
                  {contactSubmitted ? (
                    <p className="font-body text-body text-gold">Thanks — your message has been sent. I&apos;ll get back to you soon.</p>
                  ) : (
                    <>
                      {contactError && (
                        <p className="font-body text-body text-red-400">{contactError}</p>
                      )}
                      <input
                        type="text"
                        placeholder="Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="min-h-[48px] rounded-none border border-night-border bg-night-bg px-4 py-3 font-body text-base text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="min-h-[48px] rounded-none border border-night-border bg-night-bg px-4 py-3 font-body text-base text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Subject"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="min-h-[48px] rounded-none border border-night-border bg-night-bg px-4 py-3 font-body text-base text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                      />
                      <textarea
                        placeholder="Type your message here..."
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        className="min-h-[120px] resize-y rounded-none border border-night-border bg-night-bg px-4 py-3 font-body text-base text-cream placeholder:text-night-muted focus:border-gold focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          type="submit"
                          disabled={contactLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="touch-target border border-gold bg-gold/20 px-6 py-3 font-body text-body-sm uppercase tracking-widest text-paper transition hover:bg-gold/30 sm:px-8 disabled:opacity-60"
                        >
                          {contactLoading ? 'Sending…' : 'Submit'}
                        </motion.button>
                        <motion.a
                          href={`https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="touch-target inline-flex items-center gap-2 border border-night-border bg-plati-elevated px-6 py-3 font-body text-body-sm uppercase tracking-widest text-night-soft transition hover:border-gold/50 hover:text-gold sm:px-8"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Contact us
                        </motion.a>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-night-border bg-plati-dark" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
          <div className="grid gap-8 py-10 sm:grid-cols-3 sm:py-14">
            {/* Brand */}
            <div>
              <span className="font-display text-display-sm text-cream tracking-wide">Nelson Ferreira</span>
              <p className="mt-2 font-body text-caption uppercase tracking-[0.15em] text-plati-muted">
                Visual Artist · Art Teacher · PlatiGleam
              </p>
              <p className="mt-3 font-body text-caption text-night-muted leading-relaxed max-w-[18rem]">
                Master painter &amp; draughtsman. 15th-century Academic tradition. London.
              </p>
            </div>
            {/* Nav links */}
            <div className="flex flex-col gap-3">
              <span className="font-body text-caption uppercase tracking-[0.15em] text-plati-muted">Navigate</span>
              {[
                { label: 'Works', href: '#works' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '#contact' },
                { label: 'YouTube', href: YOUTUBE_CHANNEL_URL, external: true },
              ].map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="font-body text-body-sm text-night-muted transition hover:text-gleam w-fit"
                >
                  {label}
                </a>
              ))}
            </div>
            {/* Social */}
            <div>
              <span className="font-body text-caption uppercase tracking-[0.15em] text-plati-muted">Follow</span>
              <div className="mt-3 flex flex-col gap-3">
                {SOCIAL.map(({ name, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-body-sm text-night-muted transition hover:text-gleam w-fit"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-2 border-t border-night-border py-5 sm:flex-row">
            <span className="font-body text-caption text-night-muted">© {new Date().getFullYear()} Nelson Ferreira. All rights reserved.</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-body text-caption text-night-muted transition hover:text-gleam">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
