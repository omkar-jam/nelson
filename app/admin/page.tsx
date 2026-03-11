import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-12">
      <h1 className="font-display text-display-lg font-light text-paper">Dashboard</h1>
      <p className="mt-2 text-body text-plati-soft">Manage content for Nelson Ferreira</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/artworks"
          className="border border-plati-border bg-plati p-6 transition hover:border-gleam/50"
        >
          <h2 className="font-display text-display-sm font-medium text-paper">Artworks</h2>
          <p className="mt-2 text-body text-plati-soft">
            Add, edit and reorder gallery pieces (images and videos).
          </p>
        </Link>
        <Link
          href="/admin/newsletter"
          className="border border-plati-border bg-plati p-6 transition hover:border-gleam/50"
        >
          <h2 className="font-display text-display-sm font-medium text-paper">Newsletter</h2>
          <p className="mt-2 text-body text-plati-soft">
            Send bulk emails to mailing list subscribers (SMTP).
          </p>
        </Link>
      </div>
    </main>
  );
}
