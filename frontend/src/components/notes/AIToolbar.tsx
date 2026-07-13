import { useState } from 'react';
import { Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/api/featuresApi';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { key: 'summarize', label: 'Summarize' },
  { key: 'rewrite', label: 'Rewrite & polish' },
  { key: 'improve_grammar', label: 'Fix grammar' },
  { key: 'generate_title', label: 'Suggest a title' },
  { key: 'explain', label: 'Explain simply' },
  { key: 'bullet_points', label: 'Convert to bullet points' },
  { key: 'extract_key_points', label: 'Extract key points' },
  { key: 'action_items', label: 'Extract action items' },
  { key: 'meeting_summary', label: 'Summarize as meeting notes' },
  { key: 'flashcards', label: 'Generate flashcards' },
  { key: 'quiz', label: 'Generate a quiz' },
  { key: 'translate', label: 'Translate to Spanish' },
];

interface AIToolbarProps {
  plainText: string;
  onResult: (action: string, result: string) => void;
}

export function AIToolbar({ plainText, onResult }: AIToolbarProps) {
  const [open, setOpen] = useState(false);

  const runAction = useMutation({
    mutationFn: ({ action, targetLanguage }: { action: string; targetLanguage?: string }) =>
      aiApi.run(action, plainText, targetLanguage),
    onSuccess: (res, variables) => {
      onResult(variables.action, res.data.data.result);
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'AI action failed');
    },
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!plainText.trim()}
        className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent-soft/70 disabled:opacity-40"
      >
        {runAction.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        AI actions
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-card-hover">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => runAction.mutate({ action: a.key, targetLanguage: a.key === 'translate' ? 'Spanish' : undefined })}
              className={cn(
                'block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-raised',
                runAction.isPending && 'pointer-events-none opacity-50'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
