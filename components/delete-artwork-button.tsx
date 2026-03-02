'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = { artworkId: string };

export function DeleteArtworkButton({ artworkId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm('Delete this artwork?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/artworks/${artworkId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/artworks');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="border border-red-500/50 bg-red-500/10 px-4 py-2 font-body text-body-sm text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
