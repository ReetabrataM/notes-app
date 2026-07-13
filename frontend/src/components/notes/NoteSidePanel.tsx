import { useState } from 'react';
import { MessageSquare, History, Paperclip, Share2, X, Send, Trash2, RotateCcw, Upload, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { useVersions, useRestoreVersion } from '@/hooks/useVersions';
import { useAttachments, useUploadAttachment, useDeleteAttachment } from '@/hooks/useAttachments';
import { useShareSettings, useUpdatePublicAccess, useInviteCollaborator, useRemoveCollaborator } from '@/hooks/useSharing';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { exportApi } from '@/api/featuresApi';
import { resolveFileUrl } from '@/api/client';
import { cn } from '@/lib/utils';

type Tab = 'comments' | 'versions' | 'attachments' | 'share';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function NoteSidePanel({ noteId, onClose }: { noteId: string; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('comments');
  const user = useAuthStore((s) => s.user);

  const tabs: { key: Tab; label: string; icon: typeof MessageSquare }[] = [
    { key: 'comments', label: 'Comments', icon: MessageSquare },
    { key: 'versions', label: 'History', icon: History },
    { key: 'attachments', label: 'Files', icon: Paperclip },
    { key: 'share', label: 'Share', icon: Share2 },
  ];

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              title={label}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-surface-raised',
                tab === key && 'bg-accent-soft text-accent'
              )}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface-raised">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'comments' && <CommentsTab noteId={noteId} userId={user?.id} />}
        {tab === 'versions' && <VersionsTab noteId={noteId} />}
        {tab === 'attachments' && <AttachmentsTab noteId={noteId} />}
        {tab === 'share' && <ShareTab noteId={noteId} />}
      </div>
    </div>
  );
}

function CommentsTab({ noteId, userId }: { noteId: string; userId?: string }) {
  const { data: comments, isLoading } = useComments(noteId);
  const createComment = useCreateComment(noteId);
  const deleteComment = useDeleteComment(noteId);
  const [text, setText] = useState('');

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : comments?.length ? (
          comments.map((c) => (
            <div key={c._id} className="group rounded-lg border border-border p-2.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold">{c.author.name}</span>
                <span className="text-[10px] text-muted">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
              </div>
              <p className="text-sm text-ink/90">{c.content}</p>
              {c.author._id === userId && (
                <button
                  onClick={() => deleteComment.mutate(c._id)}
                  className="mt-1 text-[11px] text-muted opacity-0 hover:text-danger group-hover:opacity-100"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No comments yet. Use @username to mention someone.</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          createComment.mutate(text, { onSuccess: () => setText('') });
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none placeholder:text-muted"
        />
        <Button size="icon" type="submit">
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
}

function VersionsTab({ noteId }: { noteId: string }) {
  const { data: versions, isLoading } = useVersions(noteId);
  const restore = useRestoreVersion(noteId);

  if (isLoading) return <p className="text-sm text-muted">Loading history...</p>;
  if (!versions?.length) return <p className="text-sm text-muted">No previous versions yet. Edits create snapshots here.</p>;

  return (
    <div className="space-y-2">
      {versions.map((v) => (
        <div key={v._id} className="rounded-lg border border-border p-2.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold">{v.title || 'Untitled Note'}</span>
            <span className="text-[10px] text-muted">{formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="mb-2 line-clamp-2 text-xs text-muted">{v.plainText || 'Empty note'}</p>
          <p className="mb-1.5 text-[11px] text-muted">by {v.author?.name}</p>
          <button
            onClick={() => {
              if (confirm('Restore this version? Your current content will be saved as a new version first.')) {
                restore.mutate(v._id);
              }
            }}
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
          >
            <RotateCcw size={11} /> Restore this version
          </button>
        </div>
      ))}
    </div>
  );
}

function AttachmentsTab({ noteId }: { noteId: string }) {
  const { data: attachments, isLoading } = useAttachments(noteId);
  const upload = useUploadAttachment(noteId);
  const remove = useDeleteAttachment(noteId);

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted hover:border-accent hover:text-accent">
        <Upload size={15} />
        Upload a file
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = '';
          }}
        />
      </label>

      {isLoading ? (
        <p className="text-sm text-muted">Loading attachments...</p>
      ) : attachments?.length ? (
        attachments.map((a) => (
          <div key={a._id} className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm">
            <a href={resolveFileUrl(a.url)} target="_blank" rel="noreferrer" className="truncate hover:text-accent">
              {a.originalName}
            </a>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{formatBytes(a.size)}</span>
              <button onClick={() => remove.mutate(a._id)} className="text-danger hover:opacity-70">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted">No attachments yet.</p>
      )}
    </div>
  );
}

function ShareTab({ noteId }: { noteId: string }) {
  const { data: settings } = useShareSettings(noteId);
  const updatePublic = useUpdatePublicAccess(noteId);
  const invite = useInviteCollaborator(noteId);
  const removeCollaborator = useRemoveCollaborator(noteId);
  const [identifier, setIdentifier] = useState('');
  const [access, setAccess] = useState<'read' | 'edit'>('read');

  const publicUrl = settings ? `${window.location.origin}/shared/${settings.token}` : '';

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Public link</span>
          <button
            onClick={() => updatePublic.mutate({ isPublic: !settings?.isPublic, publicAccess: settings?.publicAccess || 'read' })}
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors',
              settings?.isPublic ? 'bg-accent' : 'bg-border'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                settings?.isPublic ? 'translate-x-4' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>
        {settings?.isPublic && (
          <>
            <input
              readOnly
              value={publicUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs outline-none"
            />
            <select
              value={settings.publicAccess}
              onChange={(e) => updatePublic.mutate({ isPublic: true, publicAccess: e.target.value as 'read' | 'edit' })}
              className="mt-2 w-full rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs outline-none"
            >
              <option value="read">Anyone with the link can view</option>
              <option value="edit">Anyone with the link can edit</option>
            </select>
          </>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Invite people</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!identifier.trim()) return;
            invite.mutate({ identifier, access }, { onSuccess: () => setIdentifier('') });
          }}
          className="flex gap-1.5"
        >
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="email or username"
            className="flex-1 rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs outline-none placeholder:text-muted"
          />
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value as 'read' | 'edit')}
            className="rounded-lg border border-border bg-canvas px-1.5 py-1.5 text-xs outline-none"
          >
            <option value="read">View</option>
            <option value="edit">Edit</option>
          </select>
          <Button size="sm" type="submit">
            Invite
          </Button>
        </form>

        <div className="mt-3 space-y-2">
          {settings?.collaborators.map((c) => (
            <div key={c.user._id} className="flex items-center justify-between text-xs">
              <span>{c.user.name} · {c.access}</span>
              <button onClick={() => removeCollaborator.mutate(c.user._id)} className="text-danger hover:opacity-70">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Export</span>
        <div className="flex gap-2">
          <a href={exportApi.markdownUrl(noteId)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-raised">
            <Download size={12} /> Markdown
          </a>
          <a href={exportApi.pdfUrl(noteId)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-raised">
            <Download size={12} /> PDF
          </a>
          <a href={exportApi.docxUrl(noteId)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-raised">
            <Download size={12} /> DOCX
          </a>
        </div>
      </div>
    </div>
  );
}
