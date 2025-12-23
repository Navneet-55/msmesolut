'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Headphones,
  Megaphone,
  DollarSign,
  Package,
  UserPlus,
  TrendingUp,
  Database,
  UserCheck,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const agents = [
  { id: 'customer_support', name: 'Customer Support', icon: Headphones, path: '/dashboard/agents/customer_support' },
  { id: 'marketing', name: 'Marketing & Content', icon: Megaphone, path: '/dashboard/agents/marketing' },
  { id: 'financial', name: 'Financial Forecast', icon: DollarSign, path: '/dashboard/agents/financial' },
  { id: 'supply_chain', name: 'Supply Chain', icon: Package, path: '/dashboard/agents/supply_chain' },
  { id: 'onboarding', name: 'Employee Onboarding', icon: UserPlus, path: '/dashboard/agents/onboarding' },
  { id: 'competitive', name: 'Competitive Analysis', icon: TrendingUp, path: '/dashboard/agents/competitive' },
  { id: 'data_integration', name: 'Data Integration', icon: Database, path: '/dashboard/agents/data_integration' },
  { id: 'sales_lead', name: 'Sales Lead', icon: UserCheck, path: '/dashboard/agents/sales_lead' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0 }}
        className={cn(
          'fixed lg:static h-screen glass border-r border-white/10 overflow-hidden',
          !isOpen && 'hidden lg:block'
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h2 className="font-bold text-lg">Lumina AI</h2>
                <p className="text-xs text-muted-foreground">Business Intelligence</p>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                pathname === '/dashboard'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              {isOpen && <span>Dashboard</span>}
            </Link>

            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
                {isOpen && 'AI Agents'}
              </p>
              <div className="space-y-1">
                {agents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={agent.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all',
                      pathname?.includes(agent.id)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <agent.icon className="w-5 h-5" />
                    {isOpen && <span className="text-sm">{agent.name}</span>}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </motion.aside>
    </>
  );
}


