import { api } from '@/shared/network/api-client';
import { setAccessToken } from '@/shared/network/token-store';
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
  if (response.data.accessToken && response.data.expiresAt) {
    setAccessToken(response.data.accessToken, response.data.expiresAt);
  }
  return response.data;
}

import { clearAccessToken } from '@/shared/network/token-store';

export async function logout(): Promise<void> {
  const response = await api.post<void>('/api/auth/logout', undefined, { requireAuth: true });
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Logout failed');
  }
  clearAccessToken();
}

export async function changePassword(request: ChangePasswordRequest): Promise<void> {
  const response = await api.post<void>('/api/auth/change-password', request, {
    requireAuth: true,
  });
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Password change failed');
  }
}

export async function refreshToken(): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/refresh', undefined, {
    requireAuth: true,
  });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Token refresh failed');
  }
  return response.data;
}