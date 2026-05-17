// components/ui/sharedStyles.ts
import { tv } from 'tailwind-variants';

export const fieldStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    label: 'text-sm font-medium text-zinc-200 mb-1.5 block',
    oprional: 'text-xs text-zinc-500 font-normal ml-2',
    helperText: 'text-xs text-zinc-400 leading-relaxed mt-1 display-block',
    input: [
      'flex h-11 w-full items-center rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100',
      'placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
      'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      'hover:border-zinc-700',
      // invalid state
      'aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus-visible:ring-red-500',
      'data-[invalid]:border-red-500 data-[invalid]:focus-visible:ring-red-500',
    ],
    errorText: 'text-xs font-medium text-red-500 mt-1.5',
  },
});
