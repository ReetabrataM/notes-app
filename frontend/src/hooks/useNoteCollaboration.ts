import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export interface PresenceUser {
  userId: string;
  name: string;
  color: string;
}

const CURSOR_COLORS = ['#E5484D', '#4FD1C5', '#C9932E', '#56CCF2', '#BB6BD9', '#6FCF97'];

function colorForUser(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export function useNoteCollaboration(
  noteId: string | undefined,
  onRemoteUpdate: (payload: { content: string; plainText: string; title: string }) => void
) {
  const user = useAuthStore((s) => s.user);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!noteId || noteId === 'new' || !user) return;
    const socket = getSocket();
    if (!socket) return;

    const color = colorForUser(user.id);
    socket.emit('note:join', { noteId, name: user.name, color });

    const handlePresence = ({ users }: { users: PresenceUser[] }) => {
      setPresence(users.filter((u) => u.userId !== user.id));
    };
    const handleUpdate = (payload: { content: string; plainText: string; title: string; from: string }) => {
      if (payload.from !== user.id) onRemoteUpdate(payload);
    };
    const handleTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) next.add(userId);
        else next.delete(userId);
        return next;
      });
    };

    socket.on('note:presence', handlePresence);
    socket.on('note:update', handleUpdate);
    socket.on('note:typing', handleTyping);

    return () => {
      socket.emit('note:leave', { noteId });
      socket.off('note:presence', handlePresence);
      socket.off('note:update', handleUpdate);
      socket.off('note:typing', handleTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, user?.id]);

  function broadcastUpdate(content: string, plainText: string, title: string) {
    if (!noteId || noteId === 'new') return;
    const socket = getSocket();
    socket?.emit('note:update', { noteId, content, plainText, title });
  }

  function broadcastTyping(isTyping: boolean) {
    if (!noteId || noteId === 'new') return;
    const socket = getSocket();
    socket?.emit('note:typing', { noteId, isTyping });
    if (isTyping) {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => socket?.emit('note:typing', { noteId, isTyping: false }), 2000);
    }
  }

  return { presence, typingUsers, broadcastUpdate, broadcastTyping };
}
