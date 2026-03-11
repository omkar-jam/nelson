import Link from 'next/link';
import { getAllPages } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const pages = await getAllPages();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-display-lg font-light text-paper">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="border border-gleam bg-gleam/10 px-4 py-2 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
        >
          Add page
        </Link>
      </div>
      <p className="mb-6 text-body text-plati-soft">
        Edit site content. Use <strong>about</strong> for the About page; <strong>home</strong> for home page JSON (bio, contact intro, studio, social links).
      </p>
      {pages.length === 0 ? (
        <p className="text-body text-plati-soft">No pages yet. Add about or home.</p>
      ) : (
        <ul className="space-y-3">
          {pages.map((page) => (
            <li key={page.id} className="flex items-center justify-between border border-plati-border bg-plati px-4 py-3">
              <div>
                <span className="font-medium text-paper">{page.title}</span>
                <span className="ml-2 font-body text-body-sm text-plati-muted">/{page.slug}</span>
              </div>
              <Link
                href={`/admin/pages/${encodeURIComponent(page.slug)}/edit`}
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
