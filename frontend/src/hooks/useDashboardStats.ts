import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/notesApi';
import { DashboardStats } from '@/types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await dashboardApi.stats();
      return data.data as DashboardStats;
    },
  });
}
