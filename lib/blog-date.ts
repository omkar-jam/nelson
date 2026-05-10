import 'server-only';

/** Invalid `Date` is truthy; never call `.toISOString()` without this check. */
export function formatPostPublishedAt(
  publishedAt: Date | null | undefined
): { iso: string; display: string } | null {
  if (publishedAt == null) return null;
  const d = publishedAt instanceof Date ? publishedAt : new Date(publishedAt);
  if (Number.isNaN(d.getTime())) return null;
  return {
    iso: d.toISOString(),
    display: d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}
