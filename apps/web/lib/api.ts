const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, name?: string) =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    me: () => fetchAPI('/auth/me'),
  },
  agents: {
    run: (agentType: string, input: any, entityId?: string) =>
      fetchAPI('/agents/run', {
        method: 'POST',
        body: JSON.stringify({ agentType, input, entityId }),
      }),
    getRuns: (agentType?: string, limit?: number) => {
      const params = new URLSearchParams();
      if (agentType) params.append('agentType', agentType);
      if (limit) params.append('limit', limit.toString());
      return fetchAPI(`/agents/runs?${params.toString()}`);
    },
    getRun: (id: string) => fetchAPI(`/agents/runs/${id}`),
  },
  dashboard: {
    get: () => fetchAPI('/data/dashboard'),
  },
};
