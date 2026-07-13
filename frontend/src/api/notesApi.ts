import { api } from './client';

export interface NoteListParams {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
  priority?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isDeleted?: boolean;
}

export const notesApi = {
  list: (params: NoteListParams) => api.get('/notes', { params }),
  get: (id: string) => api.get(`/notes/${id}`),
  create: (payload: Partial<{ title: string; content: string; plainText: string; folder: string; tagNames: string[]; color: string; priority: string }>) =>
    api.post('/notes', payload),
  update: (id: string, payload: Record<string, unknown>) => api.patch(`/notes/${id}`, payload),
  softDelete: (id: string) => api.delete(`/notes/${id}`),
  restore: (id: string) => api.post(`/notes/${id}/restore`),
  permanentDelete: (id: string) => api.delete(`/notes/${id}/permanent`),
  togglePin: (id: string) => api.post(`/notes/${id}/pin`),
  toggleArchive: (id: string) => api.post(`/notes/${id}/archive`),
  toggleFavorite: (id: string) => api.post(`/notes/${id}/favorite`),
  duplicate: (id: string) => api.post(`/notes/${id}/duplicate`),
};

export const foldersApi = {
  list: () => api.get('/folders'),
  create: (payload: { name: string; parent?: string | null; icon?: string; color?: string }) =>
    api.post('/folders', payload),
  update: (id: string, payload: Record<string, unknown>) => api.patch(`/folders/${id}`, payload),
  remove: (id: string) => api.delete(`/folders/${id}`),
};

export const tagsApi = {
  list: () => api.get('/tags'),
  create: (payload: { name: string; color?: string }) => api.post('/tags', payload),
  remove: (id: string) => api.delete(`/tags/${id}`),
};

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
};
