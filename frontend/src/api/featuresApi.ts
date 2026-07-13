import { api } from './client';

export const commentsApi = {
  list: (noteId: string) => api.get(`/comments/note/${noteId}`),
  create: (noteId: string, content: string) => api.post(`/comments/note/${noteId}`, { content }),
  remove: (id: string) => api.delete(`/comments/${id}`),
};

export const versionsApi = {
  list: (noteId: string) => api.get(`/versions/note/${noteId}`),
  restore: (noteId: string, versionId: string) => api.post(`/versions/note/${noteId}/restore/${versionId}`),
};

export const remindersApi = {
  list: (params?: { upcoming?: boolean; completed?: boolean }) => api.get('/reminders', { params }),
  create: (payload: { noteId: string; dueDate: string; recurrence?: string }) => api.post('/reminders', payload),
  complete: (id: string) => api.post(`/reminders/${id}/complete`),
  remove: (id: string) => api.delete(`/reminders/${id}`),
};

export const notificationsApi = {
  list: (page = 1) => api.get('/notifications', { params: { page } }),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export const attachmentsApi = {
  list: (noteId: string) => api.get(`/attachments/note/${noteId}`),
  upload: (noteId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/attachments/note/${noteId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  remove: (id: string) => api.delete(`/attachments/${id}`),
};

export const sharingApi = {
  getSettings: (noteId: string) => api.get(`/sharing/note/${noteId}`),
  updatePublicAccess: (noteId: string, isPublic: boolean, publicAccess: 'read' | 'edit') =>
    api.patch(`/sharing/note/${noteId}`, { isPublic, publicAccess }),
  invite: (noteId: string, identifier: string, access: 'read' | 'edit') =>
    api.post(`/sharing/note/${noteId}/collaborators`, { identifier, access }),
  removeCollaborator: (noteId: string, userId: string) =>
    api.delete(`/sharing/note/${noteId}/collaborators/${userId}`),
  getPublicNote: (token: string) => api.get(`/sharing/public/${token}`),
  sharedWithMe: () => api.get('/sharing/shared-with-me'),
};

export const adminApi = {
  listUsers: (params: { page?: number; limit?: number; search?: string }) => api.get('/admin/users', { params }),
  suspendUser: (id: string, suspended: boolean) => api.patch(`/admin/users/${id}/suspend`, { suspended }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  stats: () => api.get('/admin/stats'),
  activity: () => api.get('/admin/activity'),
};

export const aiApi = {
  run: (action: string, text: string, targetLanguage?: string) =>
    api.post('/ai/run', { action, text, targetLanguage }),
};

export const exportApi = {
  markdownUrl: (id: string) => `${api.defaults.baseURL}/export/notes/${id}/markdown`,
  pdfUrl: (id: string) => `${api.defaults.baseURL}/export/notes/${id}/pdf`,
  docxUrl: (id: string) => `${api.defaults.baseURL}/export/notes/${id}/docx`,
  importMarkdown: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/export/notes/import/markdown', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
