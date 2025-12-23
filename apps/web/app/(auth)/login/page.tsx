'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@lumina.ai');
  const [password, setPassword] = useState('demo123');

  const loginMutation = useMutation({
    mutationFn: () => api.auth.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      router.push('/dashboard');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Lumina AI</h1>
          <p className="text-muted-foreground">Intelligent Business Operations, Illuminated</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          {loginMutation.isError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {(loginMutation.error as Error)?.message || 'Login failed'}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Demo credentials: demo@lumina.ai / demo123
        </p>
      </motion.div>
    </div>
  );
}


