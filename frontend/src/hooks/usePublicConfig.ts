import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

interface PublicConfig {
  googleOAuthEnabled: boolean;
  aiEnabled: boolean;
  emailEnabled: boolean;
}

export function usePublicConfig() {
  return useQuery({
    queryKey: ['public-config'],
    queryFn: async () => {
      const { data } = await api.get('/config');
      return data.data as PublicConfig;
    },
    staleTime: Infinity,
    retry: false,
  });
}
