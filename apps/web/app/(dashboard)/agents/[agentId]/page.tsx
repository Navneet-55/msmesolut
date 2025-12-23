'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Play, Sparkles } from 'lucide-react';

const agentConfig: Record<string, { name: string; actions: string[] }> = {
  customer_support: {
    name: 'Customer Support Agent',
    actions: ['analyze_sentiment', 'generate_response', 'suggest_solution'],
  },
  marketing: {
    name: 'Marketing & Content Agent',
    actions: ['generate_content', 'create_campaign', 'optimize_campaign'],
  },
  financial: {
    name: 'Financial Forecasting Agent',
    actions: ['generate_forecast', 'analyze_cash_flow', 'detect_anomalies'],
  },
  supply_chain: {
    name: 'Supply Chain Agent',
    actions: ['optimize_inventory', 'forecast_demand', 'suggest_reorder'],
  },
  onboarding: {
    name: 'Employee Onboarding Agent',
    actions: ['create_plan', 'generate_training', 'assess_progress'],
  },
  competitive: {
    name: 'Competitive Analysis Agent',
    actions: ['analyze_competitor', 'market_research', 'competitive_positioning'],
  },
  data_integration: {
    name: 'Data Integration Agent',
    actions: ['analyze_data', 'suggest_insights', 'create_dashboard'],
  },
  sales_lead: {
    name: 'Sales Lead Agent',
    actions: ['qualify_lead', 'enrich_lead', 'score_lead'],
  },
};

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const config = agentConfig[agentId] || { name: 'Agent', actions: [] };

  const [selectedAction, setSelectedAction] = useState(config.actions[0]);
  const [input, setInput] = useState('{}');

  const runMutation = useMutation({
    mutationFn: () => {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch {
        parsedInput = { action: selectedAction };
      }
      parsedInput.action = selectedAction;
      return api.agents.run(agentId, parsedInput);
    },
  });

  const { data: runs } = useQuery({
    queryKey: ['agent-runs', agentId],
    queryFn: () => api.agents.getRuns(agentId, 10),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">{config.name}</h1>
        <p className="text-muted-foreground">AI-powered business intelligence at your fingertips</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card"
        >
          <h2 className="text-xl font-semibold mb-4">Run Agent</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {config.actions.map((action) => (
                  <option key={action} value={action}>
                    {action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input (JSON)</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>

            <button
              onClick={() => runMutation.mutate()}
              disabled={runMutation.isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {runMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Agent
                </>
              )}
            </button>

            {runMutation.isError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                {(runMutation.error as Error)?.message || 'Failed to run agent'}
              </div>
            )}

            {runMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card space-y-4"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">Result</h3>
                </div>

                {runMutation.data.reasoning && (
                  <div>
                    <p className="text-sm font-medium mb-1">Reasoning:</p>
                    <p className="text-sm text-muted-foreground">{runMutation.data.reasoning}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Output:</p>
                  <pre className="p-4 rounded-xl glass-light text-xs overflow-auto max-h-96">
                    {JSON.stringify(runMutation.data.output, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Runs</h2>
          <div className="space-y-3">
            {runs?.map((run: any) => (
              <div key={run.id} className="p-3 rounded-xl glass-light">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{run.agentType}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    run.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                    run.status === 'running' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                    'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {run.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(run.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


