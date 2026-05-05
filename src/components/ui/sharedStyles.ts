// components/ui/sharedStyles.ts
import { tv } from 'tailwind-variants';

export const fieldStyles = tv({
  slots: {
    label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block',
    input: [
      'flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
      'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      'data-[invalid]:border-red-500 data-[invalid]:focus-visible:ring-red-500'
    ],
    errorText: 'text-xs font-medium text-red-500 mt-1.5'
  }
});