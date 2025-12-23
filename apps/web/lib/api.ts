const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || 'api';

interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  requestId?: string;
  timestamp: string;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  requestId?: string;
  timestamp: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3,
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fullUrl = `${API_URL}/${API_PREFIX}${endpoint}`;

  const makeRequest = async (): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await makeRequest();

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          statusCode: response.status,
          message: 'An error occurred',
          timestamp: new Date().toISOString(),
        }));

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(
            errorData.message || `Request failed with status ${response.status}`,
          );
        }

        // Retry on server errors (5xx)
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        throw new Error(
          errorData.message || `Request failed with status ${response.status}`,
        );
      }

      const data: ApiResponse<T> = await response.json();
      return data.data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort or network errors for last attempt
      if (attempt < retries - 1 && !(error instanceof Error && error.name === 'AbortError')) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Request failed after retries');
}

interface AgentInput {
  [key: string]: unknown;
}

interface AgentRunResponse {
  id: string;
  output: Record<string, unknown>;
  reasoning: string;
}

interface AgentRun {
  id: string;
  agentType: string;
  status: string;
  output: Record<string, unknown>;
  reasoning?: string;
  createdAt: string;
  completedAt?: string;
}

interface DashboardData {
  metrics: Record<string, number>;
  recentActivity: unknown[];
  insights: unknown[];
}

export const api = {
  auth: {
    login: (email: string, password: string): Promise<{ token: string; user: unknown }> =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (
      email: string,
      password: string,
      name?: string,
    ): Promise<{ token: string; user: unknown }> =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    me: (): Promise<unknown> => fetchAPI('/auth/me'),
  },
  agents: {
    run: (
      agentType: string,
      input: AgentInput,
      entityId?: string,
    ): Promise<AgentRunResponse> =>
      fetchAPI('/agents/run', {
        method: 'POST',
        body: JSON.stringify({ agentType, input, entityId }),
      }),
    getRuns: (agentType?: string, limit?: number): Promise<AgentRun[]> => {
      const params = new URLSearchParams();
      if (agentType) params.append('agentType', agentType);
      if (limit) params.append('limit', limit.toString());
      return fetchAPI(`/agents/runs?${params.toString()}`);
    },
    getRun: (id: string): Promise<AgentRun> => fetchAPI(`/agents/runs/${id}`),
  },
  dashboard: {
    get: (): Promise<DashboardData> => fetchAPI('/data/dashboard'),
  },
};
