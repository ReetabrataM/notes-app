import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function useThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'amoled');
    root.classList.add(theme);
  }, [theme]);
}
