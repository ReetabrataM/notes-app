import { useState } from 'react';
import { Users, FileText, Ban, Activity, Search, Trash2, ShieldOff, ShieldCheck } from 'lucide-react';
import { useAdminUsers, useAdminStats, useAdminActivity, useSuspendUser, useDeleteUserAdmin } from '@/hooks/useAdmin';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: stats } = useAdminStats();
  const { data: users, isLoading } = useAdminUsers(page, search);
  const { data: activity } = useAdminActivity();
  const suspend = useSuspendUser();
  const deleteUser = useDeleteUserAdmin();

  const statCards = stats
    ? [
        { label: 'Total users', value: stats.totalUsers, icon: Users },
        { label: 'Total notes', value: stats.totalNotes, icon: FileText },
        { label: 'Suspended', value: stats.suspendedUsers, icon: Ban },
        { label: 'Active today', value: stats.activeToday, icon: Activity },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Admin dashboard</h1>
      <p className="mb-6 text-sm text-muted">Manage users and keep an eye on system health.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon size={16} />
            </div>
            <p className="font-mono text-xl font-semibold">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Users</h2>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
            <Search size={14} className="text-muted" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users..."
              className="bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Last login</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.items.map((u) => (
                  <tr key={u._id}>
                    <td className="py-2.5">{u.name}</td>
                    <td className="py-2.5 text-muted">{u.email}</td>
                    <td className="py-2.5 capitalize">{u.role}</td>
                    <td className="py-2.5">
                      <span className={u.isSuspended ? 'text-danger' : 'text-teal'}>
                        {u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted">
                      {u.lastLoginAt ? formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true }) : '—'}
                    </td>
                    <td className="py-2.5">
                      <div className="flex justify-end gap-2">
                        <button
                          title={u.isSuspended ? 'Unsuspend' : 'Suspend'}
                          onClick={() => suspend.mutate({ id: u._id, suspended: !u.isSuspended })}
                          className="rounded-lg p-1.5 hover:bg-surface-raised"
                        >
                          {u.isSuspended ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
                        </button>
                        <button
                          title="Delete user"
                          onClick={() => {
                            if (confirm(`Delete ${u.name}? This also deletes their notes.`)) deleteUser.mutate(u._id);
                          }}
                          className="rounded-lg p-1.5 text-danger hover:bg-surface-raised"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users?.meta && users.meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted">
              Page {users.meta.page} of {users.meta.totalPages}
            </span>
            <Button size="sm" variant="outline" disabled={page >= users.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-display text-base font-semibold">Recent activity</h2>
        <div className="space-y-2">
          {activity?.length ? (
            activity.map((a: any) => (
              <div key={a._id} className="flex items-center justify-between text-sm">
                <span>
                  <span className="font-medium">{a.user?.name || 'Someone'}</span> {a.action}
                </span>
                <span className="text-xs text-muted">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No activity recorded yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
