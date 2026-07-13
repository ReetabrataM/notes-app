import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/authApi';

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const token = params.get('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAccessToken(token);
    authApi
      .me()
      .then(({ data }) => {
        const u = data.data;
        setSession(
          {
            id: u._id,
            name: u.name,
            username: u.username,
            email: u.email,
            avatarUrl: u.avatarUrl,
            themePreference: u.themePreference,
            role: u.role,
          },
          token
        );
        navigate('/dashboard');
      })
      .catch(() => navigate('/login'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-muted">
      Signing you in...
    </div>
  );
}
