import env from '@/shared/config/env';
import { getAccessToken, setAccessToken, clearAccessToken, isTokenExpired } from './token-store';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string[]>;
  status: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

function getCsrfToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') return value;
  }
  return null;
}

interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (response.ok) {
    if (response.status === 204) {
      return { success: true };
    }
    if (!isJson) {
      return { success: true, data: null as unknown as T };
    }

    // Unwrap the backend's ApiResponse<T> envelope
    const envelope: BackendApiResponse<T> = await response.json();

    if (envelope.success) {
      return {
        success: true,
        data: envelope.data,
        message: envelope.message,
      };
    }

    // Backend returned a 2xx but success: false
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: envelope.message || 'Request failed',
        status: response.status,
      },
    };
  }

  let error: ApiError;
  if (isJson) {
    const body = await response.json();
    error = {
      code: mapStatusToCode(response.status),
      message: body?.detail ?? body?.message ?? body?.title ?? response.statusText,
      details: body?.errors,
      status: response.status,
    };
  } else {
    error = {
      code: mapStatusToCode(response.status),
      message: response.statusText,
      status: response.status,
    };
  }

  return { success: false, error };
}

function mapStatusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 500:
    case 502:
    case 503:
      return 'SERVER_ERROR';
    default:
      return 'NETWORK_ERROR';
  }
}

let refreshPromise: Promise<ApiResponse<unknown>> | null = null;

async function refreshAccessToken(): Promise<ApiResponse<unknown>> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await handleResponse<{ accessToken: string; expiresAt: string }>(response);
      if (result.success && result.data?.accessToken && result.data?.expiresAt) {
        setAccessToken(result.data.accessToken, result.data.expiresAt);
      } else {
        clearAccessToken();
      }
      return result;
    } catch {
      clearAccessToken();
      return { success: false, error: { code: 'NETWORK_ERROR', message: 'Token refresh failed', status: 0 } };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  requireAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, requireAuth = true, headers, ...fetchOptions } = options;

  const url = new URL(`${env.API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const csrfToken = getCsrfToken();
    if (csrfToken) {
      (requestHeaders as Record<string, string>)['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: 'include',
      signal: controller.signal,
    });

    if (response.status === 401 && requireAuth && !isTokenExpired()) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        const newToken = getAccessToken();
        if (newToken) {
          (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }

        const retryResponse = await fetch(url.toString(), {
          ...fetchOptions,
          headers: requestHeaders,
          credentials: 'include',
          signal: controller.signal,
        });

        return handleResponse<T>(retryResponse);
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: { code: 'NETWORK_ERROR', message: 'Request timeout', status: 408 },
      };
    }
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'Network error', status: 0 },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};