'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-plati-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-plati-border bg-plati p-8"
      >
        <h1 className="font-display text-display-md font-light text-paper">Admin sign in</h1>
        {error && (
          <p className="mt-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-body-sm text-red-400">
            {error}
          </p>
        )}
        <label className="mb-2 mt-6 block text-body-sm font-medium text-plati-soft">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-plati-border bg-plati-dark px-3 py-2.5 text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
        />
        <label className="mb-2 mt-4 block text-body-sm font-medium text-plati-soft">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full border border-plati-border bg-plati-dark px-3 py-2.5 text-paper placeholder:text-plati-muted focus:border-gleam focus:outline-none"
        />
        <button
          type="submit"
          className="w-full border border-gleam bg-gleam/10 py-3 font-body text-body-sm uppercase tracking-widest text-gleam transition hover:bg-gleam/20"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
