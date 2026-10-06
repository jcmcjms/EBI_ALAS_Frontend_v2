import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/app/login-page';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }: { context: any }) => {
    if (context.auth?.isAuthenticated) {
      return redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});