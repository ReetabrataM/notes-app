export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  themePreference: 'light' | 'dark' | 'amoled' | 'system';
  role?: 'user' | 'admin';
}

export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface Folder {
  _id: string;
  name: string;
  parent: string | null;
  icon: string;
  color: string;
}

export type NotePriority = 'low' | 'medium' | 'high' | 'none';

export interface Note {
  _id: string;
  title: string;
  content: string;
  plainText: string;
  folder: Folder | null;
  tags: Tag[];
  color: string;
  priority: NotePriority;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalNotes: number;
  notesCreatedToday: number;
  weeklyNotes: number;
  monthlyNotes: number;
  pinnedNotes: number;
  archivedNotes: number;
  deletedNotes: number;
  favoriteNotes: number;
  storageBytesUsed: number;
  mostUsedTags: { name: string; color: string; count: number }[];
  recentNotes: { _id: string; title: string; updatedAt: string; isPinned: boolean; color: string }[];
}

export interface Comment {
  _id: string;
  note: string;
  author: { _id: string; name: string; username: string; avatarUrl?: string };
  content: string;
  mentions: { _id: string; name: string; username: string }[];
  createdAt: string;
}

export interface NoteVersion {
  _id: string;
  note: string;
  author: { _id: string; name: string; username: string };
  title: string;
  content: string;
  plainText: string;
  createdAt: string;
}

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  _id: string;
  note: { _id: string; title: string } | string;
  dueDate: string;
  recurrence: RecurrencePattern;
  isCompleted: boolean;
}

export type NotificationType = 'note_shared' | 'comment_added' | 'mention' | 'reminder_due' | 'collaborator_joined';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  message: string;
  relatedNote?: { _id: string; title: string };
  relatedUser?: { _id: string; name: string; username: string; avatarUrl?: string };
  isRead: boolean;
  createdAt: string;
}

export interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export type ShareAccess = 'read' | 'edit';

export interface Collaborator {
  user: { _id: string; name: string; username: string; avatarUrl?: string; email?: string };
  access: ShareAccess;
}

export interface SharedLinkSettings {
  _id: string;
  note: string;
  token: string;
  isPublic: boolean;
  publicAccess: ShareAccess;
  collaborators: Collaborator[];
}

export interface AdminUserRow {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isSuspended: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalNotes: number;
  suspendedUsers: number;
  activeToday: number;
  totalStorageBytesUsed: number;
}

