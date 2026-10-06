import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from 'react'
import { getSession, invalidateSession } from '@/features/auth/api/session'
import type { MeResponse } from '@/features/auth/api/auth-types'

interface AuthContextValue {
	user: MeResponse | null
	isLoading: boolean
	isAuthenticated: boolean
	refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	const [user, setUser] = useState<MeResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const load = useCallback(async () => {
		try {
			setUser(await getSession())
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void load()
	}, [load])

	const refetch = useCallback(async () => {
		invalidateSession()
		await load()
	}, [load])

	return (
		<AuthContext.Provider
			value={{ user, isLoading, isAuthenticated: user !== null, refetch }}
		>
			{children}
		</AuthContext.Provider>
	)
}