import Link from 'next/link';
import { getAllPostsForAdmin } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-display-lg font-light text-paper">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
        >
          New post
        </Link>
      </div>
      <p className="mb-6 text-body text-plati-soft">
        Write and publish blog posts. Published posts appear on the site and on the home page blog section.
      </p>
      {posts.length === 0 ? (
        <p className="text-body text-plati-soft">No posts yet. Create your first one.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between border border-plati-border bg-plati px-4 py-3">
              <div>
                <span className="font-medium text-paper">{post.title}</span>
                <span className="ml-2 font-body text-body-sm text-plati-muted">/{post.slug}</span>
                {!post.published && (
                  <span className="ml-2 rounded bg-plati-border px-2 py-0.5 font-body text-caption text-plati-muted">
                    Draft
                  </span>
                )}
              </div>
              <Link
                href={`/admin/blog/${post.id}/edit`}
                className="text-body-sm text-plati-soft transition hover:text-gleam"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
