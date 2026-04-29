import 'react';

/** Chromium Priority Hints — `@types/react` 18 omits these on media + `<link>`. */
declare module 'react' {
  interface MediaHTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto';
  }

  interface LinkHTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto';
  }
}
