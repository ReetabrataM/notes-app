import { Link } from 'react-router-dom';
import { Feather } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas text-center">
      <Feather size={32} className="text-accent" />
      <h1 className="font-display text-4xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        This page slipped out of the margin. Let's get you back to your notes.
      </p>
      <Link to="/dashboard" className={buttonClasses('primary', 'md')}>
        Back to dashboard
      </Link>
    </div>
  );
}
