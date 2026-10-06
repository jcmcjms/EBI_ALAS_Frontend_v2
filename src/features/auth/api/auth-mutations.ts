import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, changePassword, refreshToken } from './auth-queries';
import { authKeys } from './auth-queries';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

import { invalidateSession } from '@/features/auth/api/session';

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			invalidateSession();
			queryClient.setQueryData(authKeys.me(), null);
			queryClient.clear();
		},
	});
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}