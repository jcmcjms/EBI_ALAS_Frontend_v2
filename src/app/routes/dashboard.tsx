import { lazy, Suspense } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '@/app/providers'
import { Skeleton } from '@/shared/ui/skeleton'
import type { RouterContext } from '@/app/routes/__root'

// Route-level split: keeps recharts (~110 kB gz) out of the login bundle.
const DashboardPage = lazy(() =>
  import('@/features/dashboard/ui/dashboard-page').then((m) => ({ default: m.DashboardPage }))
)

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }: { context: RouterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: function DashboardComponent() {
    const { isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )
    }

    return (
      <Suspense fallback={<Skeleton className="h-svh w-full" />}>
        <DashboardPage />
      </Suspense>
    )
  },
})