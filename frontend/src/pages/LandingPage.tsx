import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Feather, Pin, FolderTree, Search, ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: Feather,
    title: 'Write without friction',
    desc: 'A rich text editor with checklists, code blocks, and formatting that gets out of your way.',
  },
  {
    icon: FolderTree,
    title: 'Organize your way',
    desc: 'Nested folders, color-coded tags, and priorities — structure that matches how you think.',
  },
  {
    icon: Search,
    title: 'Find anything, instantly',
    desc: 'Full-text search across every note, folder, and tag, with results as you type.',
  },
  {
    icon: Pin,
    title: 'Keep what matters close',
    desc: 'Pin, favorite, and archive so your most-used notes are always one glance away.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
            <Feather size={16} />
          </div>
          <span className="font-display text-lg font-semibold">Marginalia</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink">
            Log in
          </Link>
          <Link to="/register" className={buttonClasses('primary', 'sm')}>
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-4 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            Notes, actually organized
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            The margin is where your best ideas happen.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted">
            Marginalia is a fast, focused notes app for people who think in writing — folders,
            tags, and full-text search included, no clutter added.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/register" className={buttonClasses('primary', 'lg')}>
              Start writing free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className={buttonClasses('outline', 'lg')}>
              I have an account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="dog-ear rounded-card border border-border bg-surface p-6 shadow-card-hover">
            <p className="mb-2 font-mono text-xs text-muted">Today, 9:42 AM</p>
            <h3 className="mb-3 font-display text-xl font-semibold">Q3 product roadmap</h3>
            <ul className="space-y-2 text-sm text-ink/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Ship the collaborative editor
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Finish onboarding redesign
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted" /> Explore AI summaries
              </li>
            </ul>
            <div className="mt-4 flex gap-1.5">
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                #product
              </span>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
                #planning
              </span>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-card border border-border bg-surface-raised" />
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-card border border-border bg-surface p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon size={18} />
              </div>
              <h3 className="mb-1.5 font-display text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
