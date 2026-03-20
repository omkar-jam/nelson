import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';
import { getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-plati-dark pt-24 font-body text-paper sm:pt-28">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 py-16 text-paper">
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
          className="imported-blog-content mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
    </main>
  );
}
