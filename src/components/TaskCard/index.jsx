import React from 'react';
import { CheckCircle2, Trash2, Clock } from 'lucide-react';

export default function TaskCard({ task, onComplete, onDelete }) {
  const badgeClass = task.priority === 'High' ? 'bg-rose-500/10 text-rose-200 border-rose-500/20' : task.priority === 'Low' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20';

  return (
    <div className="rounded-3xl border border-[#242F41] bg-[#0B111E] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            {task.name}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className={`rounded-full border px-2 py-1 ${badgeClass}`}>{task.priority}</span>
            {task.deadline ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.deadline}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onComplete ? (
            <button onClick={() => onComplete(task.id)} className="text-gray-300 hover:text-indigo-300">
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : null}
          {onDelete ? (
            <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
