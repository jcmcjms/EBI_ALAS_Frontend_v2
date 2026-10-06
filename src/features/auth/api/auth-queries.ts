import { api } from '@/shared/network/api-client';
import { setAccessToken, clearAccessToken } from '@/shared/network/token-store';
import type { LoginRequest, LoginResponse, ChangePasswordRequest, MeResponse } from './auth-types';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  me: () => [...authKeys.session(), 'me'] as const,
};

export async function fetchMe(): Promise<MeResponse | null> {
  const response = await api.get<MeResponse>('/api/auth/me', { requireAuth: true });
  if (!response.success || !response.data) {
    return null;
  }
  return response.data;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', request, {
    requireAuth: false,
  });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Login failed');
  }

  // Store the access token from the unwrapped response data
  setAccessToken(response.data.accessToken, response.data.expiresAt);

  return response.data;
}

export async function logout(): Promise<void> {
  const response = await api.post<void>('/api/auth/logout', undefined, { requireAuth: true });
  clearAccessToken(); // Always clear on logout
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Logout failed');
  }
}

export async function changePassword(request: ChangePasswordRequest): Promise<void> {
  const response = await api.post<void>('/api/auth/change-password', request, {
    requireAuth: true,
  });
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Password change failed');
  }
  // Password changed = session invalidated, clear token
  clearAccessToken();
}

export async function refreshToken(): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/refresh', undefined, {
    requireAuth: false, // Refresh uses cookie, not access token header
  });
  if (!response.success || !response.data) {
    clearAccessToken();
    throw new Error(response.error?.message ?? 'Token refresh failed');
  }
  setAccessToken(response.data.accessToken, response.data.expiresAt);
  return response.data;
}