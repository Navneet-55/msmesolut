'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-muted-foreground mb-6">{error.message || 'An unexpected error occurred'}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-light hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

