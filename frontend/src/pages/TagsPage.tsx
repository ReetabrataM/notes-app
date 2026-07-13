import { useState } from 'react';
import { Plus, Tag as TagIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTags } from '@/hooks/useFolders';
import { tagsApi } from '@/api/notesApi';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function TagsPage() {
  const { data: tags, isLoading } = useTags();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const createTag = useMutation({
    mutationFn: (payload: { name: string }) => tagsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
      setName('');
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Tags</h1>
      <p className="mb-6 text-sm text-muted">Label notes so they surface across folders.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createTag.mutate({ name });
        }}
        className="mb-6 flex gap-2"
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New tag name" />
        <Button type="submit" disabled={createTag.isPending}>
          <Plus size={16} /> Add
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted">Loading tags...</p>
      ) : tags?.length ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Card
              key={tag._id}
              onClick={() => navigate(`/notes?tag=${tag._id}`)}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:shadow-card-hover"
            >
              <TagIcon size={14} style={{ color: tag.color }} />
              <span className="text-sm font-medium">#{tag.name}</span>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted">No tags yet. Create your first one above.</Card>
      )}
    </div>
  );
}
