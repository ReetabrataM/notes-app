import { Search, Moon, Sun, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from './NotificationBell';

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useThemeStore();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 md:px-6">
      <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2">
        <Search size={16} className="text-muted" />
        <input
          placeholder="Search notes... (Ctrl+K)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          onFocus={() => navigate('/notes')}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => navigate('/notes/new')}>
          <Plus size={16} /> New Note
        </Button>

        <NotificationBell />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
        </div>

        <button
          onClick={() => logout.mutate()}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised"
          aria-label="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
