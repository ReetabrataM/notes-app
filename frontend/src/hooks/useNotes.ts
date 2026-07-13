import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { notesApi, NoteListParams } from '@/api/notesApi';
import { ApiResponse, Note } from '@/types';

export function useNotes(params: NoteListParams) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const { data } = await notesApi.list(params);
      return data as ApiResponse<Note[]>;
    },
    placeholderData: (prev) => prev,
  });
}

export function useNote(id?: string) {
  return useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const { data } = await notesApi.get(id!);
      return data.data as Note;
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await notesApi.create(payload);
      return data.data as Note;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Could not create the note'),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const { data } = await notesApi.update(id, payload);
      return data.data as Note;
    },
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.setQueryData(['note', note._id], note);
    },
    onError: () => toast.error('Could not save changes'),
  });
}

function useToggleAction(fn: (id: string) => Promise<any>, successMessage: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(successMessage);
    },
    onError: () => toast.error('Something went wrong'),
  });
}

export function useTogglePin() {
  return useToggleAction((id) => notesApi.togglePin(id), 'Updated');
}
export function useToggleArchive() {
  return useToggleAction((id) => notesApi.toggleArchive(id), 'Updated');
}
export function useToggleFavorite() {
  return useToggleAction((id) => notesApi.toggleFavorite(id), 'Updated');
}
export function useSoftDeleteNote() {
  return useToggleAction((id) => notesApi.softDelete(id), 'Moved to trash');
}
export function useRestoreNote() {
  return useToggleAction((id) => notesApi.restore(id), 'Note restored');
}
export function usePermanentDeleteNote() {
  return useToggleAction((id) => notesApi.permanentDelete(id), 'Deleted permanently');
}
export function useDuplicateNote() {
  return useToggleAction((id) => notesApi.duplicate(id), 'Note duplicated');
}
