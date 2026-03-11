import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import PageEditForm from './PageEditForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export default async function EditPagePage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const page = await getPageBySlug(decodedSlug);
  if (!page) notFound();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <PageEditForm page={page} />
    </main>
  );
}
