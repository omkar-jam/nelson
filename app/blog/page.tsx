import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

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
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-display-lg font-light text-paper">Blog</h1>
        <p className="mt-2 text-body text-plati-soft">
          Exhibitions, residencies and reflections
        </p>
        {posts.length === 0 ? (
          <p className="mt-12 text-body text-plati-muted">No posts yet.</p>
        ) : (
          <ul className="mt-12 space-y-8">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block border border-plati-border bg-plati p-6 transition hover:border-gleam/50"
                >
                  <h2 className="font-display text-display-sm font-medium text-paper">
                    {post.title}
                  </h2>
                  {post.publishedAt && (
                    <time
                      dateTime={post.publishedAt.toISOString()}
                      className="mt-1 block font-body text-caption text-plati-muted"
                    >
                      {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  <p className="mt-3 font-body text-body text-plati-soft line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block font-body text-body-sm uppercase tracking-widest text-gleam">
                    Read more
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
