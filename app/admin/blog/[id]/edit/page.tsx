import { getPostById } from '@/lib/posts';
import { notFound } from 'next/navigation';
import PostEditForm from './PostEditForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <PostEditForm post={post} />
    </main>
  );
}
