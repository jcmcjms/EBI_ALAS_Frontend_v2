import { fetchMe } from './auth-queries'
import type { MeResponse } from './auth-types'

let sessionPromise: Promise<MeResponse | null> | null = null

/**
 * Resolves with the current session. The first call starts (and caches) the
 * /api/auth/me restore, so route guards and AuthProvider share one request.
 */
export function getSession(): Promise<MeResponse | null> {
	sessionPromise ??= fetchMe()
	return sessionPromise
}

/** Drop the cache after login/logout so the next getSession() re-fetches. */
export function invalidateSession(): void {
	sessionPromise = null
}