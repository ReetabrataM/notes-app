import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, Pin, Archive, Star, HardDrive } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const user = useAuthStore((s) => s.user);

  const statCards = stats
    ? [
        { label: 'Total notes', value: stats.totalNotes, icon: FileText },
        { label: 'Created today', value: stats.notesCreatedToday, icon: PlusCircle },
        { label: 'Pinned', value: stats.pinnedNotes, icon: Pin },
        { label: 'Favorites', value: stats.favoriteNotes, icon: Star },
        { label: 'Archived', value: stats.archivedNotes, icon: Archive },
        { label: 'Storage used', value: formatBytes(stats.storageBytesUsed), icon: HardDrive },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">
          Good to see you, {user?.name?.split(' ')[0] || 'there'}.
        </h1>
        <p className="text-sm text-muted">Here&apos;s what&apos;s happening in your notebook.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-24 animate-pulse p-4" />
            ))
          : statCards.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon size={16} />
                </div>
                <p className="font-mono text-xl font-semibold">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold">Notes activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: 'Today', notes: stats?.notesCreatedToday || 0 },
                { name: 'This week', notes: stats?.weeklyNotes || 0 },
                { name: 'This month', notes: stats?.monthlyNotes || 0 },
              ]}
            >
              <XAxis dataKey="name" stroke="rgb(139 144 155)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: 8 }}
              />
              <Bar dataKey="notes" fill="rgb(var(--color-accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Most used tags</h2>
          <div className="space-y-3">
            {stats?.mostUsedTags?.length ? (
              stats.mostUsedTags.map((tag) => (
                <div key={tag.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    #{tag.name}
                  </span>
                  <span className="font-mono text-muted">{tag.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Tag notes to see trends here.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-display text-base font-semibold">Recent notes</h2>
        <div className="divide-y divide-border">
          {stats?.recentNotes?.length ? (
            stats.recentNotes.map((note) => (
              <Link
                key={note._id}
                to={`/notes/${note._id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-accent"
              >
                <span className="flex items-center gap-2">
                  {note.isPinned && <Pin size={13} className="text-accent" />}
                  {note.title || 'Untitled Note'}
                </span>
                <span className="font-mono text-xs text-muted">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="py-4 text-sm text-muted">No notes yet — create your first one.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
