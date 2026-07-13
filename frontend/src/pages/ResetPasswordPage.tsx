import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('Reset token is missing from the link');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      toast.success('Password reset. Please log in');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-8">
      <h1 className="mb-1 font-display text-2xl font-semibold">Set a new password</h1>
      <p className="mb-6 text-sm text-muted">Choose a new password for your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>New password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
    </Card>
  );
}
