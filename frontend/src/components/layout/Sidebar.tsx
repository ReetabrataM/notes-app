import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  StickyNote,
  FolderClosed,
  Tag,
  Archive,
  Trash2,
  Settings,
  Star,
  Feather,
  Clock,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'All Notes', icon: StickyNote },
  { to: '/notes?favorite=true', label: 'Favorites', icon: Star },
  { to: '/folders', label: 'Folders', icon: FolderClosed },
  { to: '/tags', label: 'Tags', icon: Tag },
  { to: '/reminders', label: 'Reminders', icon: Clock },
  { to: '/shared-with-me', label: 'Shared with me', icon: Share2 },
  { to: '/archive', label: 'Archive', icon: Archive },
  { to: '/trash', label: 'Trash', icon: Trash2 },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
          <Feather size={16} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">Marginalia</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-surface-raised hover:text-ink',
                isActive && 'bg-accent-soft text-ink'
              )
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-surface-raised hover:text-ink',
            isActive && 'bg-accent-soft text-ink'
          )
        }
      >
        <Settings size={17} />
        Settings
      </NavLink>

      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            cn(
              'mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-surface-raised hover:text-ink',
              isActive && 'bg-accent-soft text-ink'
            )
          }
        >
          <ShieldCheck size={17} />
          Admin
        </NavLink>
      )}
    </aside>
  );
}
