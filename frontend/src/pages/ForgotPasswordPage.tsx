import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { buttonClasses } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  return (
    <Card className="p-8 text-center">
      <h1 className="mb-2 font-display text-2xl font-semibold">Password reset</h1>
      <p className="mb-6 text-sm text-muted">
        Email-based password reset is on the roadmap and isn't wired up in this build yet. For now, contact
        an administrator to reset your password directly in the database.
      </p>
      <Link to="/login" className={buttonClasses('outline', 'md')}>
        Back to login
      </Link>
    </Card>
  );
}
