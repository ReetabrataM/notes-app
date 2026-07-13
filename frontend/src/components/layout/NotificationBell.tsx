import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, AtSign, Share2, Clock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { NotificationType } from '@/types';
import { cn } from '@/lib/utils';

const ICONS: Record<NotificationType, typeof Bell> = {
  note_shared: Share2,
  comment_added: MessageSquare,
  mention: AtSign,
  reminder_due: Clock,
  collaborator_joined: UserPlus,
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = data?.unreadCount || 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 rounded-card border border-border bg-surface shadow-card-hover">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button onClick={() => markAllRead.mutate()} className="text-xs text-accent hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {data?.items?.length ? (
              data.items.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <Link
                    key={n._id}
                    to={n.relatedNote ? `/notes/${n.relatedNote._id}` : '#'}
                    onClick={() => {
                      if (!n.isRead) markRead.mutate(n._id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex items-start gap-3 border-b border-border px-4 py-3 text-sm hover:bg-surface-raised',
                      !n.isRead && 'bg-accent-soft/40'
                    )}
                  >
                    <Icon size={15} className="mt-0.5 shrink-0 text-accent" />
                    <div>
                      <p className="text-ink/90">{n.message}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="p-6 text-center text-sm text-muted">You're all caught up.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
