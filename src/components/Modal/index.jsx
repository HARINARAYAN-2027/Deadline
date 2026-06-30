import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ visible, title, children, onClose, actions }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop: sits below the card, does NOT intercept clicks/keyboard */}
      <div
        className="absolute inset-0 z-40 bg-slate-950/80 pointer-events-none"
        aria-hidden="true"
      />

      {/* Card wrapper: highest interactive layer with explicit pointer-events/stacking */}
      <div className="relative z-50 flex min-h-full items-center justify-center p-4 pointer-events-auto">
        <div className="w-full max-w-xl rounded-3xl border border-[#242F41] bg-[#11151D] shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#242F41] px-6 py-4">
            <div>
              <h3 className="text-lg font-black text-white">{title || 'Dialog'}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-sm text-gray-200">{children}</div>

          {actions ? (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#242F41] px-6 py-4">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

