import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';
import { usePublicConfig } from '@/hooks/usePublicConfig';

const schema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const login = useLogin();
  const { data: config } = usePublicConfig();

  return (
    <Card className="p-8">
      <h1 className="mb-1 font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-muted">Log in to keep writing where you left off.</p>

      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
        <div>
          <Label>Email or username</Label>
          <Input placeholder="you@example.com" {...register('identifier')} error={errors.identifier?.message} />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/70">
            <input type="checkbox" {...register('rememberMe')} className="rounded border-border" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      {config?.googleOAuthEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/google`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium hover:bg-surface-raised"
          >
            Continue with Google
          </a>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </Card>
  );
}
