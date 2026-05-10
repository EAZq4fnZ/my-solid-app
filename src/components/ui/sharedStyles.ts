// components/ui/sharedStyles.ts
import { tv } from 'tailwind-variants';

export const fieldStyles = tv({
  slots: {
    label: 'text-sm font-medium text-zinc-200 mb-1.5 block', // 文字色を少し明るく
    oprional: 'text-xs text-zinc-500 font-normal ml-2',
    helperText: 'text-xs text-zinc-400 leading-relaxed mt-1 display-block', // zinc-500から400へ。blockを明示
    input: [
      'flex h-11 w-full items-center rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100', // h-10からh-11へ
      'placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
      'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      'hover:border-zinc-700', // ホバーで少し境界を明るく
    ],
    errorText: 'text-xs font-medium text-red-500 mt-1.5',
  },
});
