'use client';

import { ScrollReveal } from '@/components/ScrollReveal';

const DEFAULT_LOGO_CLASS =
  'client-logo max-h-12 w-auto max-w-[85%] object-contain transition duration-300 group-hover:opacity-100 sm:max-h-14';

const TEXT_LOGO_CLASS =
  'client-logo h-full w-auto max-w-full origin-center scale-[1.12] object-contain transition duration-300 group-hover:opacity-100 sm:scale-[1.18]';

const SELECTED_CLIENTS = [
  {
    name: 'National Portrait Gallery, London',
    logo: '/clients/npg.svg',
    width: 376,
    height: 58,
    logoClassName: TEXT_LOGO_CLASS,
    logoWrapperClassName: 'overflow-visible px-1',
  },
  {
    name: 'UNESCO',
    logo: '/clients/unesco.svg',
    width: 120,
    height: 120,
  },
  {
    name: 'UNICEF',
    logo: '/clients/unicef.svg',
    width: 140,
    height: 48,
  },
  {
    name: 'Walt Disney / Industrial Light & Magic',
    logo: '/clients/walt-disney-ilm.svg',
    width: 280,
    height: 68,
    logoClassName: TEXT_LOGO_CLASS,
    logoWrapperClassName: 'overflow-visible px-1',
  },
  {
    name: 'Bank of America',
    logo: '/clients/bank-of-america.svg',
    width: 220,
    height: 24,
  },
  {
    name: 'UBS Bank',
    logo: '/clients/ubs.svg',
    width: 100,
    height: 40,
  },
  {
    name: 'Saatchi Gallery',
    logo: '/clients/saatchi.svg',
    width: 180,
    height: 36,
  },
  {
    name: "Sainsbury's",
    logo: '/clients/sainsburys.svg',
    width: 180,
    height: 34,
  },
] as const;

export function SelectedClients() {
  return (
    <section className="relative border-y border-night-border bg-plati-dark py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
        <ScrollReveal once={false} variant="fade" className="mb-8 text-center sm:mb-10">
          <h2 className="font-display text-display-sm font-light tracking-wide text-cream sm:text-display-md">
            Selected Clients
          </h2>
          <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-gleam/50 to-transparent" />
        </ScrollReveal>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          {SELECTED_CLIENTS.map((client, i) => (
            <ScrollReveal key={client.name} once={false} variant="fade" delay={0.05 * i}>
              <li className="group flex h-full flex-col items-center justify-center text-center">
                <div
                  className={`flex h-20 w-full items-center justify-center sm:h-24 ${
                    'logoWrapperClassName' in client ? client.logoWrapperClassName : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={client.width}
                    height={client.height}
                    loading="lazy"
                    decoding="async"
                    className={'logoClassName' in client && client.logoClassName
                      ? client.logoClassName
                      : DEFAULT_LOGO_CLASS}
                  />
                </div>
                <p className="mt-3 font-body text-[0.65rem] uppercase leading-snug tracking-[0.12em] text-plati-muted transition-colors duration-300 group-hover:text-plati-soft sm:text-caption">
                  {client.name}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
