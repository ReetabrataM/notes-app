import { useState } from 'react';
import { CheckCircle2, Trash2, Repeat } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { useReminders, useCompleteReminder, useDeleteReminder } from '@/hooks/useReminders';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function RemindersPage() {
  const { data: reminders, isLoading } = useReminders();
  const completeReminder = useCompleteReminder();
  const deleteReminder = useDeleteReminder();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [month] = useState(new Date());

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

  function reminderNoteTitle(reminder: any) {
    return typeof reminder.note === 'string' ? 'Note' : reminder.note?.title || 'Untitled Note';
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-display text-2xl font-semibold">Reminders</h1>
          <p className="text-sm text-muted">Stay on top of due dates, one-off or recurring.</p>
        </div>
        <div className="flex rounded-lg border border-border p-1">
          <button
            onClick={() => setView('list')}
            className={cn('rounded-md px-3 py-1 text-sm', view === 'list' && 'bg-accent-soft text-accent')}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={cn('rounded-md px-3 py-1 text-sm', view === 'calendar' && 'bg-accent-soft text-accent')}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === 'list' ? (
        isLoading ? (
          <p className="text-sm text-muted">Loading reminders...</p>
        ) : reminders?.length ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <Card key={reminder._id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{reminderNoteTitle(reminder)}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    {format(new Date(reminder.dueDate), 'PPP p')}
                    {reminder.recurrence !== 'none' && (
                      <span className="flex items-center gap-1 text-accent">
                        <Repeat size={11} /> {reminder.recurrence}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => completeReminder.mutate(reminder._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-teal hover:bg-surface-raised"
                    title="Mark complete"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteReminder.mutate(reminder._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-surface-raised"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-sm text-muted">
            No reminders yet. Set one from a note's editor.
          </Card>
        )
      ) : (
        <Card className="p-4">
          <p className="mb-3 text-center font-display font-semibold">{format(month, 'MMMM yyyy')}</p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="py-1 font-medium">
                {d}
              </div>
            ))}
            {days.map((day) => {
              const dayReminders = reminders?.filter((r) => isSameDay(new Date(r.dueDate), day)) || [];
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'flex h-16 flex-col items-center rounded-lg border border-transparent p-1 text-sm',
                    isToday(day) && 'border-accent bg-accent-soft/40'
                  )}
                >
                  <span>{format(day, 'd')}</span>
                  {dayReminders.length > 0 && (
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" title={`${dayReminders.length} reminder(s)`} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
