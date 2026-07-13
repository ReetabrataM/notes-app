import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, AtSign, Share2, Clock, UserPlus } from 'lucide-react';
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '@/hooks/useNotifications';
import { NotificationType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const ICONS: Record<NotificationType, typeof Bell> = {
  note_shared: Share2,
  comment_added: MessageSquare,
  mention: AtSign,
  reminder_due: Clock,
  collaborator_joined: UserPlus,
};

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        {!!data?.unreadCount && (
          <Button size="sm" variant="outline" onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : data?.items.length ? (
        <div className="space-y-2">
          {data.items.map((n) => {
            const Icon = ICONS[n.type] || Bell;
            return (
              <Link key={n._id} to={n.relatedNote ? `/notes/${n.relatedNote._id}` : '#'} onClick={() => !n.isRead && markRead.mutate(n._id)}>
                <Card className={cn('flex items-start gap-3 p-4', !n.isRead && 'border-accent/40 bg-accent-soft/30')}>
                  <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">You're all caught up.</Card>
      )}
    </div>
  );
}
