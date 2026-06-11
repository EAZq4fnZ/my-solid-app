// src/components/ui/DatePicker/types.ts
import type { DateValue } from '@ark-ui/solid/date-picker';

/**
 * UI層がピュアに扱うカレンダー基本Props
 */
export interface DatePickerProps {
  // 共通 Props(<Fieldset>,<Field>から継承)
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  // <DatePicker> 固有の Props
  value: DateValue[]; 
  onValueChange: (value: DateValue[]) => void;
  granularity?: 'day' | 'minute';
  disabled?: boolean;
  readOnly?: boolean;
  selectionMode?: 'single' | 'multiple';
}

/**
 * 各暦モジュールからコンポーネントへ引き渡す、暦特化型のDI拡張Props
 * 
 */
export interface EraDatePickerProps extends DatePickerProps {
  calendarId: string;
  locale: string;
  timeZone: string;
  inputPlaceholder: string;
}

/**
 * 簡易的なUIスタイリング用のクラス定義群
 */
export const datePickerStyles = {
  inputGroup: () =>
    'flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-zinc-400 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
};