import { Link } from 'react-router-dom';
import { Eye, Pencil } from 'lucide-react';
import { useSharedWithMe } from '@/hooks/useSharing';
import { Card } from '@/components/ui/Card';

export default function SharedWithMePage() {
  const { data, isLoading } = useSharedWithMe();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Shared with me</h1>
      <p className="mb-6 text-sm text-muted">Notes other people have invited you to view or edit.</p>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : data?.length ? (
        <div className="space-y-3">
          {data.map(({ note, access, linkId }) => (
            <Link key={linkId} to={`/notes/${note?._id}`}>
              <Card className="flex items-center justify-between p-4 hover:shadow-card-hover">
                <span className="font-medium">{note?.title || 'Untitled Note'}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  {access === 'edit' ? <Pencil size={13} /> : <Eye size={13} />}
                  {access === 'edit' ? 'Can edit' : 'Can view'}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">No notes have been shared with you yet.</Card>
      )}
    </div>
  );
}
