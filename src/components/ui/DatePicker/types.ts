// src/components/ui/DatePicker/types.ts
import type { DateValue } from '@ark-ui/solid/date-picker';
import type { FieldProps } from '../Field';

/**
 * DatePicker の基本的なプロパティ
 */
/** UIコンポーネント上で設定させる プロパティ */
export interface BaseOptions {
  disabled?: boolean;
  readOnly?: boolean;
  granularity?: 'day' | 'minute';
  selectionMode?: 'single' | 'multiple';
} /** 各カレンダーモジュール のプロパティ */
export interface ModuleConfig {
  calendarId: string;
  locale: string;
  timeZone: string;
  inputPlaceholder: string;
}
/** value,onValueChange などをオーバーライドするときに使用 */
export interface OverrideProps {
  value: DateValue[];
  onValueChange: (value: DateValue[]) => void;
}
/** FieldProps,ModuleConfig,OverrideProps,BaseOptions を統合し、これをDatePicker に渡す */
export interface EraDatePickerProps
  extends FieldProps,
    BaseOptions,
    ModuleConfig,
    OverrideProps {}

/**
 * 簡易的なUIスタイリング用のクラス定義群
 */
export const datePickerStyles = {
  inputGroup: () =>
    'flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-zinc-400 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
};
