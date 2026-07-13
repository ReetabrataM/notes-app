import { useState } from 'react';
import { FolderClosed, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useFolders, useCreateFolder } from '@/hooks/useFolders';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { notesApi } from '@/api/notesApi';
import { cn } from '@/lib/utils';

export default function FoldersPage() {
  const { data: folders, isLoading } = useFolders();
  const createFolder = useCreateFolder();
  const [name, setName] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleDrop(folderId: string, e: React.DragEvent) {
    e.preventDefault();
    setDragOverId(null);
    const noteId = e.dataTransfer.getData('text/note-id');
    if (!noteId) return;
    try {
      await notesApi.update(noteId, { folder: folderId });
      toast.success('Note moved to folder');
      qc.invalidateQueries({ queryKey: ['notes'] });
    } catch {
      toast.error('Could not move note');
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Folders</h1>
      <p className="mb-6 text-sm text-muted">
        Group your notes into folders. Drag a note card here from All Notes to file it away.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createFolder.mutate({ name }, { onSuccess: () => setName('') });
        }}
        className="mb-6 flex gap-2"
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New folder name" />
        <Button type="submit" disabled={createFolder.isPending}>
          <Plus size={16} /> Add
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted">Loading folders...</p>
      ) : folders?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {folders.map((folder) => (
            <Card
              key={folder._id}
              onClick={() => navigate(`/notes?folder=${folder._id}`)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(folder._id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => handleDrop(folder._id, e)}
              className={cn(
                'flex cursor-pointer items-center gap-3 p-4 transition-colors hover:shadow-card-hover',
                dragOverId === folder._id && 'border-accent bg-accent-soft/40'
              )}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${folder.color}22`, color: folder.color }}
              >
                <FolderClosed size={17} />
              </div>
              <span className="font-medium">{folder.name}</span>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">No folders yet. Create your first one above.</Card>
      )}
    </div>
  );
}
