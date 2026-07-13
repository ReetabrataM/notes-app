import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sharingApi } from '@/api/featuresApi';
import { SharedLinkSettings } from '@/types';

export function useShareSettings(noteId?: string) {
  return useQuery({
    queryKey: ['sharing', noteId],
    queryFn: async () => {
      const { data } = await sharingApi.getSettings(noteId!);
      return data.data as SharedLinkSettings;
    },
    enabled: !!noteId,
  });
}

export function useUpdatePublicAccess(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ isPublic, publicAccess }: { isPublic: boolean; publicAccess: 'read' | 'edit' }) =>
      sharingApi.updatePublicAccess(noteId, isPublic, publicAccess),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sharing', noteId] }),
  });
}

export function useInviteCollaborator(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ identifier, access }: { identifier: string; access: 'read' | 'edit' }) =>
      sharingApi.invite(noteId, identifier, access),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sharing', noteId] }),
  });
}

export function useRemoveCollaborator(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => sharingApi.removeCollaborator(noteId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sharing', noteId] }),
  });
}

export function useSharedWithMe() {
  return useQuery({
    queryKey: ['shared-with-me'],
    queryFn: async () => {
      const { data } = await sharingApi.sharedWithMe();
      return data.data as { note: any; access: string; linkId: string }[];
    },
  });
}
