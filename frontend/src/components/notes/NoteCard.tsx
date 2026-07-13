import { Link } from 'react-router-dom';
import { Pin, Star, Archive, Copy, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Note } from '@/types';
import { cn } from '@/lib/utils';
import {
  useTogglePin,
  useToggleFavorite,
  useToggleArchive,
  useSoftDeleteNote,
  useDuplicateNote,
} from '@/hooks/useNotes';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface NoteCardProps {
  note: Note;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function NoteCard({ note, selectable, selected, onToggleSelect }: NoteCardProps) {
  const togglePin = useTogglePin();
  const toggleFavorite = useToggleFavorite();
  const toggleArchive = useToggleArchive();
  const softDelete = useSoftDeleteNote();
  const duplicate = useDuplicateNote();

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e: any) => e.dataTransfer.setData('text/note-id', note._id)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative flex flex-col rounded-card border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover',
        note.isPinned && 'dog-ear'
      )}
      style={{ borderTopColor: note.color !== '#FFFFFF' ? note.color : undefined, borderTopWidth: note.color !== '#FFFFFF' ? 3 : undefined }}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onToggleSelect?.(note._id)}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-3 top-3 z-10 h-4 w-4 rounded border-border"
        />
      )}
      <Link to={`/notes/${note._id}`} className="flex-1">
        <h3 className="mb-1.5 line-clamp-1 font-display text-base font-semibold text-ink">
          {note.title || 'Untitled Note'}
        </h3>
        <p className="mb-3 line-clamp-3 text-sm text-muted">{stripHtml(note.content) || 'No content yet...'}</p>
      </Link>

      {note.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag._id}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${tag.color}22`, color: tag.color }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-muted">
        <span className="flex items-center gap-1 font-mono">
          <Clock size={11} /> {note.readingTimeMinutes} min read
        </span>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            title="Pin"
            onClick={() => togglePin.mutate(note._id)}
            className={cn('rounded p-1 hover:bg-surface-raised', note.isPinned && 'text-accent')}
          >
            <Pin size={14} />
          </button>
          <button
            title="Favorite"
            onClick={() => toggleFavorite.mutate(note._id)}
            className={cn('rounded p-1 hover:bg-surface-raised', note.isFavorite && 'text-accent')}
          >
            <Star size={14} />
          </button>
          <button title="Duplicate" onClick={() => duplicate.mutate(note._id)} className="rounded p-1 hover:bg-surface-raised">
            <Copy size={14} />
          </button>
          <button title="Archive" onClick={() => toggleArchive.mutate(note._id)} className="rounded p-1 hover:bg-surface-raised">
            <Archive size={14} />
          </button>
          <button title="Delete" onClick={() => softDelete.mutate(note._id)} className="rounded p-1 hover:bg-surface-raised hover:text-danger">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
