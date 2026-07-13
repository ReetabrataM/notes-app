import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '@/api/authApi';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore, ThemeMode } from '@/store/themeStore';
import { useLogout } from '@/hooks/useAuth';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useThemeStore();
  const logout = useLogout();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await authApi.me();
      setBio(data.data.bio || '');
      return data.data;
    },
  });

  const changePassword = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('Password changed. Please log in again');
      logout.mutate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not change password'),
  });

  const logoutAll = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      toast.success('Logged out from all devices');
      logout.mutate();
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="mb-1 font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted">Manage your profile, appearance, and security.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Bio</Label>
            <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio" />
          </div>
          <Button onClick={() => toast.success('Profile updated')}>Save changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Appearance</h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'amoled'] as ThemeMode[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-lg border px-4 py-2 text-sm capitalize ${
                theme === t ? 'border-accent bg-accent-soft text-accent' : 'border-border'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Change password</h2>
        <div className="space-y-4">
          <div>
            <Label>Current password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label>New password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button onClick={() => changePassword.mutate()} disabled={changePassword.isPending}>
            Update password
          </Button>
        </div>
      </Card>

      <Card className="border-danger/30 p-6">
        <h2 className="mb-2 font-display text-base font-semibold text-danger">Danger zone</h2>
        <p className="mb-4 text-sm text-muted">Log out from every device where you're currently signed in.</p>
        <Button variant="danger" onClick={() => logoutAll.mutate()}>
          Log out of all devices
        </Button>
      </Card>
    </div>
  );
}
