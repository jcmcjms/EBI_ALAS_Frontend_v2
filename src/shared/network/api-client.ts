import env from '@/shared/config/env';

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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (response.ok) {
    if (response.status === 204) {
      return { success: true };
    }
    const data = isJson ? await response.json() : null;
    return { success: true, data: data as T };
  }

  let error: ApiError;
  if (isJson) {
    const body = await response.json();
    error = {
      code: mapStatusToCode(response.status),
      message: body?.detail ?? body?.message ?? response.statusText,
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