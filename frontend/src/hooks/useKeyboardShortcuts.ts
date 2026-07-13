import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutHandlers {
  onNewNote?: () => void;
  onSearch?: () => void;
  onCommandPalette?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey;
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handlers.onCommandPalette?.();
        return;
      }

      if (isTyping) return;

      if (isMod && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handlers.onNewNote?.() ?? navigate('/notes/new');
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
