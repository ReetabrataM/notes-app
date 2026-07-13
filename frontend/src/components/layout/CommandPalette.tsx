import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  StickyNote,
  FolderClosed,
  Tag,
  Archive,
  Trash2,
  Settings,
  LayoutDashboard,
  Bell,
  Clock,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const itemClass =
  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent-soft aria-selected:text-accent';

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();

  function go(path: string) {
    navigate(path);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
        <Command
          label="Command palette"
          className="overflow-hidden rounded-card border border-border bg-surface shadow-card-hover"
        >
          <Command.Input
            autoFocus
            placeholder="Type a command or search..."
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-sm text-muted">No results found.</Command.Empty>

            <Command.Group heading="Actions" className="px-2 py-1 text-xs font-medium text-muted">
              <Command.Item onSelect={() => go('/notes/new')} className={itemClass}>
                <Plus size={15} /> New note
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigate" className="px-2 py-1 text-xs font-medium text-muted">
              <Command.Item onSelect={() => go('/dashboard')} className={itemClass}>
                <LayoutDashboard size={15} /> Dashboard
              </Command.Item>
              <Command.Item onSelect={() => go('/notes')} className={itemClass}>
                <StickyNote size={15} /> All notes
              </Command.Item>
              <Command.Item onSelect={() => go('/folders')} className={itemClass}>
                <FolderClosed size={15} /> Folders
              </Command.Item>
              <Command.Item onSelect={() => go('/tags')} className={itemClass}>
                <Tag size={15} /> Tags
              </Command.Item>
              <Command.Item onSelect={() => go('/reminders')} className={itemClass}>
                <Clock size={15} /> Reminders
              </Command.Item>
              <Command.Item onSelect={() => go('/archive')} className={itemClass}>
                <Archive size={15} /> Archive
              </Command.Item>
              <Command.Item onSelect={() => go('/trash')} className={itemClass}>
                <Trash2 size={15} /> Trash
              </Command.Item>
              <Command.Item onSelect={() => go('/notifications')} className={itemClass}>
                <Bell size={15} /> Notifications
              </Command.Item>
              <Command.Item onSelect={() => go('/settings')} className={itemClass}>
                <Settings size={15} /> Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
