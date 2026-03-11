import Link from 'next/link';
import { getPageBySlug } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  return (
    <main className="min-h-screen">
      <nav className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Nelson Ferreira
          </Link>
          <div className="flex gap-6">
            <Link href="/gallery" className="hover:underline">Gallery</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-6 text-3xl font-bold">
          {page?.title ?? 'About'}
        </h1>
        <div className="prose prose-gray max-w-none">
          {page?.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p>
              This is the artist&apos;s about page. Create a page with slug <strong>about</strong> in
              Admin → Pages to edit this content.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
