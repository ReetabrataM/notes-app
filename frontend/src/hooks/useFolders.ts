import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foldersApi, tagsApi } from '@/api/notesApi';
import { Folder, Tag } from '@/types';

export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data } = await foldersApi.list();
      return data.data as Folder[];
    },
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; icon?: string; color?: string }) => foldersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await tagsApi.list();
      return data.data as Tag[];
    },
  });
}
