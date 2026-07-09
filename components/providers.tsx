'use client';

/** Pass-through provider. SessionProvider removed — public pages never use useSession. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
