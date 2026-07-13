import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRegister } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/\d/, 'Include at least one number'),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const registerUser = useRegister();

  return (
    <Card className="p-8">
      <h1 className="mb-1 font-display text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-muted">Start your notebook in under a minute.</p>

      <form onSubmit={handleSubmit((values) => registerUser.mutate(values))} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
        </div>
        <div>
          <Label>Username</Label>
          <Input placeholder="janedoe" {...register('username')} error={errors.username?.message} />
        </div>
        <div>
          <Label>Email</Label>
          <Input placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" disabled={registerUser.isPending}>
          {registerUser.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
