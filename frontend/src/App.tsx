import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeSync } from '@/hooks/useThemeSync';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import OAuthSuccessPage from '@/pages/OAuthSuccessPage';
import SharedPublicNotePage from '@/pages/SharedPublicNotePage';
import DashboardPage from '@/pages/DashboardPage';
import NotesListPage from '@/pages/NotesListPage';
import NoteEditorPage from '@/pages/NoteEditorPage';
import FoldersPage from '@/pages/FoldersPage';
import TagsPage from '@/pages/TagsPage';
import ArchivePage from '@/pages/ArchivePage';
import TrashPage from '@/pages/TrashPage';
import RemindersPage from '@/pages/RemindersPage';
import SharedWithMePage from '@/pages/SharedWithMePage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  useThemeSync();

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shared/:token" element={<SharedPublicNotePage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/:id" element={<NoteEditorPage />} />
            <Route path="/folders" element={<FoldersPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/shared-with-me" element={<SharedWithMePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
