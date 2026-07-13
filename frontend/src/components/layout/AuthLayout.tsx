import { Outlet, Link } from 'react-router-dom';
import { Feather } from 'lucide-react';
import { Footer } from './Footer';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-black">
              <Feather size={18} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Marginalia</span>
          </Link>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
