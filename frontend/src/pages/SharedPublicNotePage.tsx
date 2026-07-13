import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Feather, Lock } from 'lucide-react';
import { sharingApi } from '@/api/featuresApi';
import { Footer } from '@/components/layout/Footer';

export default function SharedPublicNotePage() {
  const { token } = useParams();
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    sharingApi
      .getPublicNote(token)
      .then(({ data }) => {
        setNote(data.data.note);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-border px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
            <Feather size={16} />
          </div>
          <span className="font-display text-lg font-semibold">Marginalia</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        {state === 'loading' && <p className="text-sm text-muted">Loading shared note...</p>}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-2 pt-16 text-center">
            <Lock className="text-muted" size={28} />
            <p className="font-display text-lg font-semibold">This link isn't available</p>
            <p className="text-sm text-muted">It may have been unshared or never existed.</p>
          </div>
        )}
        {state === 'ready' && note && (
          <article>
            <h1 className="mb-4 font-display text-3xl font-semibold">{note.title || 'Untitled Note'}</h1>
            <div
              className="prose prose-sm max-w-none text-ink prose-headings:font-display"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
