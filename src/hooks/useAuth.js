
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, validateToken } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
  });

  const validationQuery = useQuery({
    queryKey: ['auth', 'validate', token],
    queryFn: validateToken,
    enabled: false,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    token,
    user,
    isAuthenticated,
    logout,
    hydrateAuth,
    loginMutation,
    registerMutation,
    validationQuery,
  };
};
