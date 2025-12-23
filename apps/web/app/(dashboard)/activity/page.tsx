'use client';

import { motion } from 'framer-motion';
import { Activity, User, Zap, Settings, LogIn, FileText, Download, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ActivityItem {
  id: string;
  type: 'login' | 'agent_run' | 'settings_change' | 'export' | 'user_action';
  user: string;
  action: string;
  details?: string;
  timestamp: Date;
}

// Demo activity data
const demoActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'agent_run',
    user: 'Demo User',
    action: 'Ran Financial Forecasting Agent',
    details: 'Generated Q4 revenue forecast',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'login',
    user: 'Demo User',
    action: 'Logged in',
    details: 'IP: 192.168.1.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    type: 'settings_change',
    user: 'Admin',
    action: 'Updated notification settings',
    details: 'Enabled email alerts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '4',
    type: 'agent_run',
    user: 'Demo User',
    action: 'Ran Customer Support Agent',
    details: 'Analyzed 50 tickets',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: '5',
    type: 'export',
    user: 'Demo User',
    action: 'Exported data',
    details: 'Downloaded leads report (CSV)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '6',
    type: 'user_action',
    user: 'Admin',
    action: 'Created new user',
    details: 'Added john@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '7',
    type: 'agent_run',
    user: 'Demo User',
    action: 'Ran Marketing Agent',
    details: 'Generated 5 content pieces',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

const typeFilters = [
  { value: 'all', label: 'All Activity' },
  { value: 'agent_run', label: 'Agent Runs' },
  { value: 'login', label: 'Logins' },
  { value: 'settings_change', label: 'Settings' },
  { value: 'export', label: 'Exports' },
  { value: 'user_action', label: 'User Actions' },
];

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login':
        return <LogIn className="w-5 h-5 text-blue-500" />;
      case 'agent_run':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'settings_change':
        return <Settings className="w-5 h-5 text-orange-500" />;
      case 'export':
        return <Download className="w-5 h-5 text-green-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredActivity = filter === 'all'
    ? demoActivity
    : demoActivity.filter((item) => item.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Activity Log</h1>
          <p className="text-muted-foreground">Track all actions and events in your workspace</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'glass-light hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-0 overflow-hidden"
      >
        <div className="divide-y divide-white/10">
          {filteredActivity.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl glass-light flex items-center justify-center flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{item.user}</span>
                    <span className="text-muted-foreground">{item.action}</span>
                  </div>
                  {item.details && (
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {filteredActivity.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No activity found for this filter</p>
        </div>
      )}
    </div>
  );
}

