import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { remindersApi } from '@/api/featuresApi';
import { Reminder } from '@/types';

export function useReminders(params?: { upcoming?: boolean; completed?: boolean }) {
  return useQuery({
    queryKey: ['reminders', params],
    queryFn: async () => {
      const { data } = await remindersApi.list(params);
      return data.data as Reminder[];
    },
  });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { noteId: string; dueDate: string; recurrence?: string }) => remindersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}

export function useCompleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.complete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}
