import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { versionsApi } from '@/api/featuresApi';
import { NoteVersion } from '@/types';

export function useVersions(noteId?: string) {
  return useQuery({
    queryKey: ['versions', noteId],
    queryFn: async () => {
      const { data } = await versionsApi.list(noteId!);
      return data.data as NoteVersion[];
    },
    enabled: !!noteId,
  });
}

export function useRestoreVersion(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (versionId: string) => versionsApi.restore(noteId, versionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['note', noteId] });
      qc.invalidateQueries({ queryKey: ['versions', noteId] });
    },
  });
}
