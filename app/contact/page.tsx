import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Artist
          </Link>
          <div className="flex gap-6">
            <Link href="/gallery" className="hover:underline">Gallery</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="mb-6 text-3xl font-bold">Contact</h1>
        <p className="text-gray-600">
          Get in touch. You can add a contact form or email link here.
        </p>
      </section>
    </main>
  );
}
