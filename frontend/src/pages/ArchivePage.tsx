import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/notes/NoteCard';
import { Card } from '@/components/ui/Card';

export default function ArchivePage() {
  const { data, isLoading } = useNotes({ isArchived: true, limit: 50 });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Archive</h1>
      <p className="mb-6 text-sm text-muted">Notes you've tucked away but kept around.</p>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : data?.data.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">Nothing archived yet.</Card>
      )}
    </div>
  );
}
