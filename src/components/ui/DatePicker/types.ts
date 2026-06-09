// src/components/ui/DatePicker/types.ts
import type { IsoDateString, IsoDateTimeString } from '@/types/date';

/**
 * 完全にカプセル化された共通の Props 契約
 * ComboboxProps の構造と綺麗に対称させています。
 */
export interface BaseDatePickerProps {
  value: IsoDateString | IsoDateTimeString | null;
  // biome-ignore lint/suspicious/noExplicitAny: <any型を使用>
  onValueChange: (value: any) => void;
  label: string; //
  error?: string; //
  helperText?: string;
  optional?: boolean;
  granularity?: 'day' | 'minute';
  disabled?: boolean;
  readOnly?: boolean;
  template?: string;
}

export const datePickerStyles = {
  // 高さを h-11、背景色を bg-zinc-800 に統一し、Combobox の input スロットの外観と完全に同期
  inputGroup: () =>
    'flex h-11 w-full items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  displayText: () =>
    'text-sm text-zinc-100 font-sans cursor-text select-none block w-full text-left',
};
