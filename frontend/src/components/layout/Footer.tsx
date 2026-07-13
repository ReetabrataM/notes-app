export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted">
      <p>
        Marginalia &copy; {new Date().getFullYear()} — Designed &amp; built by{' '}
        <span className="font-medium text-ink/80">Reetabrata Mandal</span>
      </p>
    </footer>
  );
}
