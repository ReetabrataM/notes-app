import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { disconnectSocket } from '@/lib/socket';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: { identifier: string; password: string; rememberMe?: boolean }) =>
      authApi.login(payload),
    onSuccess: ({ data }) => {
      setSession(data.data.user, data.data.accessToken);
      toast.success('Welcome back');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: { name: string; username: string; email: string; password: string }) =>
      authApi.register(payload),
    onSuccess: () => {
      toast.success('Account created. Please log in');
      navigate('/login');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearSession();
      disconnectSocket();
      navigate('/login');
    },
  });
}
