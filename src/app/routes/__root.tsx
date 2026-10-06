import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
  HeadContent,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/shared/ui/sonner';
import type { MeResponse } from '@/features/auth/api/auth-types';

export interface RouterContext {
  auth: {
    user: MeResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'ALAS v2 - Enterprise Application' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <div className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <Toaster position="top-right" richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </div>
    </>
  ),
});