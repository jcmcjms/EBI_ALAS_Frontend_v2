import type { MeResponse } from '@/features/auth/api/auth-types';

export interface RouterContext {
  auth: {
    user: MeResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };
}

declare module '@tanstack/react-router' {
  interface Register {
    context: RouterContext;
  }
}