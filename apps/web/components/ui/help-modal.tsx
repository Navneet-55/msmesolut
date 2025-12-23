'use client';

import { useState } from 'react';
import { HelpCircle, X, Keyboard, Book, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { keys: ['/', 'Ctrl+K'], description: 'Focus search' },
  { keys: ['Ctrl+H'], description: 'Go to dashboard' },
  { keys: ['Ctrl+N'], description: 'New item' },
  { keys: ['Esc'], description: 'Close modal/menu' },
];

const resources = [
  { icon: Book, title: 'Documentation', description: 'Learn how to use Lumina AI', href: '#' },
  { icon: MessageCircle, title: 'Support', description: 'Get help from our team', href: '#' },
];

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'resources'>('shortcuts');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl glass-light hover:bg-white/10 transition-all"
        aria-label="Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="glass-card w-full max-w-lg max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold">Help & Resources</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('shortcuts')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'shortcuts'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Keyboard className="w-4 h-4 inline-block mr-2" />
                    Keyboard Shortcuts
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'resources'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Book className="w-4 h-4 inline-block mr-2" />
                    Resources
                  </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[50vh]">
                  {activeTab === 'shortcuts' ? (
                    <div className="space-y-3">
                      {shortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl glass-light"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {i > 0 && <span className="text-muted-foreground text-xs">or</span>}
                                <kbd className="px-2 py-1 text-xs rounded bg-white/10 border border-white/20">
                                  {key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.href}
                          className="flex items-center gap-4 p-4 rounded-xl glass-light hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <resource.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 text-center text-sm text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-xs">?</kbd> anytime to open this help
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

