import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import type { RouterContext } from '@/app/routes/__root';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }: { context: RouterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: function DashboardComponent() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.fullName ?? user?.username}</CardTitle>
            <CardDescription>You are authenticated and connected to the backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-muted-foreground">User ID</h4>
                <p className="font-mono">{user?.id}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Email</h4>
                <p>{user?.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Roles</h4>
                <p>{user?.roles.join(', ') || 'None'}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Permissions</h4>
                <p>{user?.permissions.join(', ') || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
});