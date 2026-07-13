import { useState } from 'react';
import { BellPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateReminder } from '@/hooks/useReminders';

export function ReminderButton({ noteId }: { noteId: string }) {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const createReminder = useCreateReminder();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised"
        title="Set a reminder"
      >
        <BellPlus size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-64 space-y-3 rounded-xl border border-border bg-surface p-3 shadow-card-hover">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Due date &amp; time</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-canvas px-2 py-1.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Repeat</label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="w-full rounded-lg border border-border bg-canvas px-2 py-1.5 text-sm outline-none"
            >
              <option value="none">Doesn't repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!dueDate) {
                toast.error('Pick a date and time first');
                return;
              }
              createReminder.mutate(
                { noteId, dueDate: new Date(dueDate).toISOString(), recurrence },
                {
                  onSuccess: () => {
                    toast.success('Reminder set');
                    setOpen(false);
                    setDueDate('');
                  },
                }
              );
            }}
            className="w-full rounded-lg bg-accent py-1.5 text-sm font-medium text-black hover:brightness-110"
          >
            Set reminder
          </button>
        </div>
      )}
    </div>
  );
}
