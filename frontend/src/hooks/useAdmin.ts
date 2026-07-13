import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/featuresApi';
import { AdminUserRow, SystemStats } from '@/types';

export function useAdminUsers(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const { data } = await adminApi.listUsers({ page, limit: 20, search });
      return { items: data.data as AdminUserRow[], meta: data.meta };
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await adminApi.stats();
      return data.data as SystemStats;
    },
  });
}

export function useAdminActivity() {
  return useQuery({
    queryKey: ['admin-activity'],
    queryFn: async () => {
      const { data } = await adminApi.activity();
      return data.data as any[];
    },
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) => adminApi.suspendUser(id, suspended),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useDeleteUserAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}
