import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-plati-dark font-body text-paper">
      {session && (
        <header className="border-b border-plati-border bg-plati px-4 py-3 sm:px-6 md:px-12">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/admin" className="font-display text-display-sm font-medium text-paper">
              Admin
            </Link>
            <div className="flex gap-4 sm:gap-6">
              <Link href="/admin/artworks" className="text-body-sm text-plati-soft transition hover:text-gleam">
                Artworks
              </Link>
              <Link href="/" className="text-body-sm text-plati-soft transition hover:text-gleam">
                View site
              </Link>
              <Link href="/api/auth/signout" className="text-body-sm text-plati-muted transition hover:text-gleam">
                Sign out
              </Link>
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
