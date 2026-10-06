import type { MeResponse } from '@/features/auth/api/auth-types'

export interface RouterContext {
	auth: {
		/** Awaits the in-flight session restore on first call; cached afterwards. */
		getSession: () => Promise<MeResponse | null>
	}
}