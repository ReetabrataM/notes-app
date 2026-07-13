import { PresenceUser } from '@/hooks/useNoteCollaboration';

export function PresenceAvatars({ users }: { users: PresenceUser[] }) {
  if (!users.length) return null;

  return (
    <div className="flex items-center -space-x-2">
      {users.slice(0, 5).map((u) => (
        <div
          key={u.userId}
          title={u.name}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface text-xs font-semibold text-white"
          style={{ backgroundColor: u.color }}
        >
          {u.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {users.length > 5 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-muted text-xs font-semibold text-white">
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}
