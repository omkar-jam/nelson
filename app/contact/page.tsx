import { SiteNav } from '@/components/SiteNav';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-plati-dark pt-24 font-body text-paper sm:pt-28">
      <SiteNav />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-6 font-display text-display-lg font-light text-paper">Contact</h1>
        <p className="text-body text-plati-soft">
          Get in touch. You can add a contact form or email link here.
        </p>
      </section>
    </main>
  );
}
