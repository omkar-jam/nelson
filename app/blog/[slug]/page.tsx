import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-plati-dark font-body text-paper">
      <nav className="border-b border-plati-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-paper">
            Nelson Ferreira
          </Link>
          <div className="flex gap-6 text-plati-soft">
            <Link href="/gallery" className="hover:text-gleam">Gallery</Link>
            <Link href="/about" className="hover:text-gleam">About</Link>
            <Link href="/contact" className="hover:text-gleam">Contact</Link>
            <Link href="/blog" className="hover:text-gleam">Blog</Link>
          </div>
        </div>
      </nav>
      <article className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/blog" className="text-body-sm text-plati-soft transition hover:text-gleam">
          ← Blog
        </Link>
        <h1 className="mt-6 font-display text-display-md font-light text-paper sm:text-display-lg">
          {post.title}
        </h1>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="mt-2 block font-body text-caption text-plati-muted"
          >
            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        )}
        <div
          className="imported-blog-content prose prose-invert mt-8 max-w-none text-night-soft prose-p:font-body prose-p:text-body prose-a:text-gleam prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:rounded-sm prose-figure:mx-0 [&_iframe]:max-w-full [&_video]:max-w-full"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
    </main>
  );
}
