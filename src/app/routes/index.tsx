import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/app/login-page';
import type { RouterContext } from '@/app/routes/__root';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }: { context: RouterContext }) => {
    // Redirect authenticated users away from the login page
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});