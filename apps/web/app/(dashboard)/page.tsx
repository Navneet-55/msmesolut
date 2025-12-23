'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Ticket, DollarSign, Users, TrendingUp, Inbox } from 'lucide-react';
import { SkeletonStats, SkeletonList, EmptyState } from '@/components/ui';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard.get(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-10 w-48 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-64 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStats key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg mb-4 animate-pulse" />
            <SkeletonList count={3} />
          </div>
          <div className="glass-card p-6">
            <div className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg mb-4 animate-pulse" />
            <SkeletonList count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={Inbox}
        title="Failed to load dashboard"
        description="We couldn't load your dashboard data. Please try refreshing the page."
        action={{
          label: 'Refresh',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const stats = [
    {
      label: 'Open Tickets',
      value: data?.tickets?.open || 0,
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Revenue',
      value: `$${((data?.financial?.revenue || 0) / 1000).toFixed(1)}k`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Qualified Leads',
      value: data?.leads?.qualified || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Net Income',
      value: `$${((data?.financial?.net || 0) / 1000).toFixed(1)}k`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          {data?.tickets?.recent && data.tickets.recent.length > 0 ? (
            <div className="space-y-3">
              {data.tickets.recent.map((ticket: any) => (
                <div key={ticket.id} className="p-3 rounded-xl glass-light hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">{ticket.number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      ticket.status === 'resolved' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                      'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Ticket}
              title="No tickets yet"
              description="Tickets will appear here once they're created."
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
          {data?.leads?.recent && data.leads.recent.length > 0 ? (
            <div className="space-y-3">
              {data.leads.recent.map((lead: any) => (
                <div key={lead.id} className="p-3 rounded-xl glass-light hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{lead.name || lead.email}</p>
                      <p className="text-sm text-muted-foreground">{lead.company || 'No company'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Score: {lead.score}</p>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        lead.status === 'qualified' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                        'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No leads yet"
              description="Leads will appear here once they're created."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}


