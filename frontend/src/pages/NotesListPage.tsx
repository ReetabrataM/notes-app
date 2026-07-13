import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, CheckSquare, Upload, Archive, Trash2, Tag as TagIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/notes/NoteCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/api/client';
import { exportApi } from '@/api/featuresApi';

const PRIORITIES = ['none', 'low', 'medium', 'high'];

export default function NotesListPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priority, setPriority] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const qc = useQueryClient();

  const favorite = searchParams.get('favorite') === 'true';
  const folderFilter = searchParams.get('folder') || undefined;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isPlaceholderData } = useNotes({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    priority: priority || undefined,
    isFavorite: favorite || undefined,
    folder: folderFilter,
  });

  async function runBulk(action: 'delete' | 'archive' | 'tag') {
    const noteIds = Array.from(selected);
    if (!noteIds.length) return;
    try {
      if (action === 'delete') {
        await api.post('/notes/bulk/delete', { noteIds });
        toast.success('Notes moved to trash');
      } else if (action === 'archive') {
        await api.post('/notes/bulk/archive', { noteIds, isArchived: true });
        toast.success('Notes archived');
      } else if (action === 'tag') {
        const tagNames = prompt('Add tags (comma separated):');
        if (!tagNames) return;
        await api.post('/notes/bulk/tag', {
          noteIds,
          tagNames: tagNames.split(',').map((t) => t.trim()).filter(Boolean),
        });
        toast.success('Tags applied');
      }
      setSelected(new Set());
      setSelectMode(false);
      qc.invalidateQueries({ queryKey: ['notes'] });
    } catch {
      toast.error('Bulk action failed');
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      await exportApi.importMarkdown(file);
      toast.success('Note imported');
      qc.invalidateQueries({ queryKey: ['notes'] });
    } catch {
      toast.error('Could not import that file');
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{favorite ? 'Favorite notes' : 'All notes'}</h1>
          <p className="text-sm text-muted">{data?.meta?.total ?? 0} notes</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
            <Search size={15} className="text-muted" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search notes..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
            <SlidersHorizontal size={15} className="text-muted" />
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-sm outline-none"
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-raised">
            <Upload size={14} /> Import
            <input type="file" accept=".md,.markdown,text/markdown" className="hidden" onChange={handleImport} />
          </label>

          <Button
            size="sm"
            variant={selectMode ? 'primary' : 'outline'}
            onClick={() => {
              setSelectMode((s) => !s);
              setSelected(new Set());
            }}
          >
            <CheckSquare size={14} /> Select
          </Button>
        </div>
      </div>

      {selectMode && selected.size > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-2 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <button onClick={() => runBulk('archive')} className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-surface-raised">
              <Archive size={13} /> Archive
            </button>
            <button onClick={() => runBulk('tag')} className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-surface-raised">
              <TagIcon size={13} /> Tag
            </button>
            <button onClick={() => runBulk('delete')} className="flex items-center gap-1 rounded-lg px-2 py-1 text-danger hover:bg-surface-raised">
              <Trash2 size={13} /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-surface-raised">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse p-4" />
          ))}
        </div>
      ) : data?.data.length ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                selectable={selectMode}
                selected={selected.has(note._id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>

          {data.meta && data.meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <button
                disabled={isPlaceholderData || page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
          <p className="font-display text-lg font-semibold">No notes here yet</p>
          <p className="text-sm text-muted">Create a new note to get started.</p>
        </Card>
      )}
    </div>
  );
}
