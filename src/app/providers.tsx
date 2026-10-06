import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { fetchMe } from '@/features/auth/api/auth-queries';
import type { MeResponse } from '@/features/auth/api/auth-types';
import { router } from '@/app/router';

interface AuthContextValue {
  user: MeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchMe();
      if (mountedRef.current) {
        setUser(data);
        router.update({
          context: {
            auth: { user: data, isLoading: false, isAuthenticated: !!data },
          },
        });
      }
    } catch {
      if (mountedRef.current) {
        setUser(null);
        router.update({
          context: {
            auth: { user: null, isLoading: false, isAuthenticated: false },
          },
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();
    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}