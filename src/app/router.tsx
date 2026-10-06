import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/app/routeTree.gen';
import type { MeResponse } from '@/features/auth/api/auth-types';

interface RouterContext {
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

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      user: null,
      isLoading: true,
      isAuthenticated: false,
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}