import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/featuresApi';
import { Comment } from '@/types';

export function useComments(noteId?: string) {
  return useQuery({
    queryKey: ['comments', noteId],
    queryFn: async () => {
      const { data } = await commentsApi.list(noteId!);
      return data.data as Comment[];
    },
    enabled: !!noteId,
  });
}

export function useCreateComment(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => commentsApi.create(noteId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', noteId] }),
  });
}

export function useDeleteComment(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', noteId] }),
  });
}
