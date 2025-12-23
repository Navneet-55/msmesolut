'use client';

import { useState } from 'react';
import { Bell, Search, User, LogOut, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/toast';
import { useGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts';

export function TopBar() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useGlobalShortcuts();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      toast.info(`Searching for "${searchQuery}"...`);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search... (Press / or Ctrl+K)"
              className="w-full pl-10 pr-20 py-2 rounded-xl glass-light border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Search"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">/</kbd>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl glass-light hover:bg-white/10 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl glass-light hover:bg-white/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}


