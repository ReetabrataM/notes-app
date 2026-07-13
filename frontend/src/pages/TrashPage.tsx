import { RotateCcw, Trash2 } from 'lucide-react';
import { useNotes, useRestoreNote, usePermanentDeleteNote } from '@/hooks/useNotes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TrashPage() {
  const { data, isLoading } = useNotes({ isDeleted: true, limit: 50 });
  const restore = useRestoreNote();
  const permanentDelete = usePermanentDeleteNote();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Trash</h1>
      <p className="mb-6 text-sm text-muted">Deleted notes stay here until you remove them for good.</p>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : data?.data.length ? (
        <div className="space-y-3">
          {data.data.map((note) => (
            <Card key={note._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{note.title || 'Untitled Note'}</p>
                <p className="text-xs text-muted">Deleted note</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => restore.mutate(note._id)}>
                  <RotateCcw size={14} /> Restore
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm('Permanently delete this note? This cannot be undone.')) {
                      permanentDelete.mutate(note._id);
                    }
                  }}
                >
                  <Trash2 size={14} /> Delete forever
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">Trash is empty.</Card>
      )}
    </div>
  );
}
