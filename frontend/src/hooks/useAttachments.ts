import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attachmentsApi } from '@/api/featuresApi';
import { Attachment } from '@/types';

export function useAttachments(noteId?: string) {
  return useQuery({
    queryKey: ['attachments', noteId],
    queryFn: async () => {
      const { data } = await attachmentsApi.list(noteId!);
      return data.data as Attachment[];
    },
    enabled: !!noteId,
  });
}

export function useUploadAttachment(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => attachmentsApi.upload(noteId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attachments', noteId] }),
  });
}

export function useDeleteAttachment(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attachmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attachments', noteId] }),
  });
}
