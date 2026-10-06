import { lazy, Suspense } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { RouterContext } from '@/app/router-context'
import { useAuth } from '@/app/providers'

// Route-level split: keeps recharts (~110 kB gz) out of the login bundle.
const DashboardPage = lazy(() =>
	import('@/features/dashboard/ui/dashboard-page').then((m) => ({ default: m.DashboardPage }))
)

export const Route = createFileRoute('/dashboard')({
	beforeLoad: async ({ context }: { context: RouterContext }) => {
		if (!(await context.auth.getSession())) {
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
			<Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
				<DashboardPage />
			</Suspense>
		)
	},
})