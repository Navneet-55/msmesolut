'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Play, Sparkles, History } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { EmptyState, SkeletonList } from '@/components/ui';

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
  const toast = useToast();
  const agentId = params.agentId as string;
  const config = agentConfig[agentId] || { name: 'Agent', actions: [] };

  const [selectedAction, setSelectedAction] = useState(config.actions[0]);
  const [input, setInput] = useState('{}');
  const [jsonError, setJsonError] = useState('');

  const runMutation = useMutation({
    mutationFn: () => {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (e) {
        parsedInput = { action: selectedAction };
      }
      parsedInput.action = selectedAction;
      return api.agents.run(agentId, parsedInput);
    },
    onSuccess: () => {
      toast.success('Agent run completed successfully!');
      runsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to run agent');
    },
  });

  const runsQuery = useQuery({
    queryKey: ['agent-runs', agentId],
    queryFn: () => api.agents.getRuns(agentId, 10),
  });

  const { data: runs, isLoading: runsLoading } = runsQuery;

  const validateJSON = (value: string) => {
    if (!value.trim()) {
      setJsonError('');
      return true;
    }
    try {
      JSON.parse(value);
      setJsonError('');
      return true;
    } catch (e) {
      setJsonError('Invalid JSON format');
      return false;
    }
  };

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
              <label htmlFor="agent-input" className="block text-sm font-medium mb-2">
                Input (JSON) - Optional
              </label>
              <textarea
                id="agent-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  validateJSON(e.target.value);
                }}
                onBlur={(e) => validateJSON(e.target.value)}
                rows={8}
                className={`w-full px-4 py-3 rounded-xl glass-light border font-mono text-sm focus:outline-none focus:ring-2 transition-all ${
                  jsonError
                    ? 'border-red-500/50 focus:ring-red-500/50'
                    : 'border-white/20 focus:ring-primary/50'
                }`}
                placeholder='{"key": "value"}'
                aria-invalid={!!jsonError}
                aria-describedby={jsonError ? 'json-error' : undefined}
              />
              {jsonError && (
                <p id="json-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {jsonError}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty or provide JSON input. The action will be automatically added.
              </p>
            </div>

            <button
              onClick={() => {
                if (!jsonError) {
                  runMutation.mutate();
                }
              }}
              disabled={runMutation.isPending || !!jsonError}
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
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Recent Runs</h2>
          </div>
          {runsLoading ? (
            <SkeletonList count={5} />
          ) : runs && runs.length > 0 ? (
            <div className="space-y-3">
              {runs.map((run: any) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl glass-light hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => {
                    // TODO: Show run details
                    toast.info(`Run ${run.id} - ${run.status}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{run.agentType}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      run.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                      run.status === 'running' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      run.status === 'failed' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                      'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(run.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No runs yet"
              description="Run the agent to see execution history here."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}


