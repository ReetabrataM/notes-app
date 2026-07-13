import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/api/authApi';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { buttonClasses } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    api
      .post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center">
      {status === 'loading' && <Loader2 className="animate-spin text-accent" size={32} />}
      {status === 'success' && <CheckCircle2 className="text-teal" size={32} />}
      {status === 'error' && <XCircle className="text-danger" size={32} />}

      <h1 className="font-display text-xl font-semibold">
        {status === 'loading' && 'Verifying your email...'}
        {status === 'success' && 'Email verified'}
        {status === 'error' && 'Verification failed'}
      </h1>
      <p className="text-sm text-muted">
        {status === 'success' && 'Your email is confirmed. You can now log in.'}
        {status === 'error' && 'This link is invalid or has expired. Please request a new one.'}
      </p>
      <Link to="/login" className={buttonClasses('primary', 'md')}>
        Back to login
      </Link>
    </Card>
  );
}
