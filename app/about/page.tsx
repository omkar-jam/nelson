import { SiteNav } from '@/components/SiteNav';
import { getPageBySlug } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  return (
    <main className="min-h-screen bg-plati-dark pt-24 font-body text-paper sm:pt-28">
      <SiteNav />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-6 font-display text-display-lg font-light text-paper">
          {page?.title ?? 'About'}
        </h1>
        <div className="imported-blog-content max-w-none text-plati-soft">
          {page?.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p className="text-body">
              This is the artist&apos;s about page. Create a page with slug <strong>about</strong> in
              Admin → Pages to edit this content.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
