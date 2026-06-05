// src/features/px/components/pxFormStyles.ts
import { tv } from 'tailwind-variants';

export const pxFormStyles = tv({
  slots: {
    form: 'space-y-6 max-w-xl bg-zinc-900/50 p-6 rounded-xl border border-zinc-800',
    grid: 'grid grid-cols-2 gap-4',
    fieldGroup: 'flex flex-col gap-1.5',
    label: 'text-xs font-medium text-zinc-400',
    error: 'text-xs font-semibold text-red-400 animate-in fade-in-0 duration-200',
    submitBtn: 'w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded-md transition-colors text-sm shadow-sm',
  }
});