import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, PanelRightOpen, Sparkles, X } from 'lucide-react';
import { RichTextEditor } from '@/components/notes/RichTextEditor';
import { PresenceAvatars } from '@/components/notes/PresenceAvatars';
import { NoteSidePanel } from '@/components/notes/NoteSidePanel';
import { AIToolbar } from '@/components/notes/AIToolbar';
import { VoiceOcrToolbar } from '@/components/notes/VoiceOcrToolbar';
import { ReminderButton } from '@/components/notes/ReminderButton';
import { useNote, useCreateNote, useUpdateNote } from '@/hooks/useNotes';
import { useFolders } from '@/hooks/useFolders';
import { useNoteCollaboration } from '@/hooks/useNoteCollaboration';
import { Button } from '@/components/ui/Button';

const PRIORITIES = ['none', 'low', 'medium', 'high'];
const COLORS = ['#FFFFFF', '#F2C94C', '#EB5757', '#6FCF97', '#56CCF2', '#BB6BD9'];

export default function NoteEditorPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const { data: existingNote, isLoading } = useNote(isNew ? undefined : id);
  const { data: folders } = useFolders();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [folder, setFolder] = useState('');
  const [priority, setPriority] = useState('none');
  const [color, setColor] = useState('#FFFFFF');
  const [tagsInput, setTagsInput] = useState('');
  const [noteId, setNoteId] = useState<string | undefined>(isNew ? undefined : id);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPanel, setShowPanel] = useState(false);
  const [aiResult, setAiResult] = useState<{ action: string; text: string } | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { presence, broadcastUpdate, broadcastTyping } = useNoteCollaboration(noteId, (payload) => {
    setTitle(payload.title);
    setContent(payload.content);
    setPlainText(payload.plainText);
  });

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setPlainText(existingNote.plainText);
      setFolder(existingNote.folder?._id || '');
      setPriority(existingNote.priority);
      setColor(existingNote.color);
      setTagsInput(existingNote.tags.map((t) => t.name).join(', '));
    }
  }, [existingNote]);

  function scheduleSave(payload: Record<string, unknown>) {
    setSaveState('saving');
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      if (noteId) {
        await updateNote.mutateAsync({ id: noteId, payload });
      } else {
        const note = await createNote.mutateAsync(payload);
        setNoteId(note._id);
        navigate(`/notes/${note._id}`, { replace: true });
      }
      setSaveState('saved');
    }, 700);
  }

  function buildPayload(overrides: Record<string, unknown> = {}) {
    return {
      title,
      content,
      plainText,
      folder: folder || null,
      priority,
      color,
      tagNames: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ...overrides,
    };
  }

  function applyAIResult(replace: boolean) {
    if (!aiResult) return;
    const wrapped = `<p>${aiResult.text.replace(/\n/g, '<br/>')}</p>`;
    const newContent = replace ? wrapped : `${content}${wrapped}`;
    const newPlainText = replace ? aiResult.text : `${plainText} ${aiResult.text}`;

    if (aiResult.action === 'generate_title') {
      setTitle(aiResult.text);
      scheduleSave(buildPayload({ title: aiResult.text }));
    } else {
      setContent(newContent);
      setPlainText(newPlainText);
      scheduleSave(buildPayload({ content: newContent, plainText: newPlainText }));
    }
    setAiResult(null);
  }

  if (!isNew && isLoading) {
    return <div className="flex h-full items-center justify-center text-muted">Loading note...</div>;
  }

  return (
    <div className="flex h-full">
      <div className="mx-auto max-w-3xl flex-1 overflow-y-auto pr-2">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft size={15} /> Back to notes
          </button>

          <div className="flex items-center gap-3">
            <PresenceAvatars users={presence} />
            <div className="flex items-center gap-1.5 text-xs text-muted">
              {saveState === 'saving' && (
                <>
                  <Loader2 size={13} className="animate-spin" /> Saving...
                </>
              )}
              {saveState === 'saved' && (
                <>
                  <Check size={13} className="text-teal" /> Saved
                </>
              )}
            </div>
            {noteId && <ReminderButton noteId={noteId} />}
            {noteId && (
              <button
                onClick={() => setShowPanel((s) => !s)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised"
                title="Comments, history, files, sharing"
              >
                <PanelRightOpen size={16} />
              </button>
            )}
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave(buildPayload({ title: e.target.value }));
            broadcastUpdate(content, plainText, e.target.value);
          }}
          placeholder="Untitled Note"
          className="mb-4 w-full bg-transparent font-display text-3xl font-semibold outline-none placeholder:text-muted/50"
        />

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <select
            value={folder}
            onChange={(e) => {
              setFolder(e.target.value);
              scheduleSave(buildPayload({ folder: e.target.value || null }));
            }}
            className="rounded-lg border border-border bg-surface px-2 py-1.5"
          >
            <option value="">No folder</option>
            {folders?.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              scheduleSave(buildPayload({ priority: e.target.value }));
            }}
            className="rounded-lg border border-border bg-surface px-2 py-1.5"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)} priority
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  scheduleSave(buildPayload({ color: c }));
                }}
                className="h-6 w-6 rounded-full border border-border"
                style={{ backgroundColor: c, outline: color === c ? '2px solid rgb(var(--color-accent))' : 'none' }}
              />
            ))}
          </div>

          <input
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              scheduleSave(buildPayload({ tagNames: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }));
            }}
            placeholder="tags, comma, separated"
            className="min-w-[180px] flex-1 rounded-lg border border-border bg-surface px-2 py-1.5 outline-none placeholder:text-muted"
          />

          <div className="ml-auto flex items-center gap-2">
            <VoiceOcrToolbar
              onText={(text) => {
                const newPlainText = `${plainText} ${text}`;
                const newContent = `${content}<p>${text}</p>`;
                setPlainText(newPlainText);
                setContent(newContent);
                scheduleSave(buildPayload({ content: newContent, plainText: newPlainText }));
              }}
            />
            <AIToolbar plainText={plainText} onResult={(action, text) => setAiResult({ action, text })} />
          </div>
        </div>

        {aiResult && (
          <div className="mb-4 rounded-xl border border-accent/30 bg-accent-soft/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                <Sparkles size={14} /> AI suggestion
              </span>
              <button onClick={() => setAiResult(null)} className="text-muted hover:text-ink">
                <X size={14} />
              </button>
            </div>
            <p className="mb-3 whitespace-pre-wrap text-sm text-ink/90">{aiResult.text}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => applyAIResult(false)}>
                Append to note
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyAIResult(true)}>
                Replace note content
              </Button>
            </div>
          </div>
        )}

        <RichTextEditor
          content={content}
          onChange={(html, text) => {
            setContent(html);
            setPlainText(text);
            scheduleSave(buildPayload({ content: html, plainText: text }));
            broadcastUpdate(html, text, title);
            broadcastTyping(true);
          }}
        />

        {plainText && (
          <p className="mt-6 font-mono text-xs text-muted">
            {plainText.trim().split(/\s+/).filter(Boolean).length} words · {plainText.length} characters
          </p>
        )}
      </div>

      {showPanel && noteId && <NoteSidePanel noteId={noteId} onClose={() => setShowPanel(false)} />}
    </div>
  );
}
