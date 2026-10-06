import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/app/routeTree.gen'
import { getSession } from '@/features/auth/api/session'
import type { RouterContext } from '@/app/router-context'

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export const router = createRouter({
	routeTree,
	// Guards await getSession(); no React state involved, so reloads are safe.
	context: { auth: { getSession } } satisfies RouterContext,
	defaultPreload: 'intent',
	defaultPendingComponent: () => (
		<div className="flex h-svh items-center justify-center">
			<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
		</div>
	),
})