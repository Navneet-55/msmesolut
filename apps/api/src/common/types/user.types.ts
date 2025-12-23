export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  currentOrganizationId: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

