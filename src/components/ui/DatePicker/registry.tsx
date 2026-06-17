// src/components/ui/DatePicker/registry.tsx
import type { DatePickerModule } from './core';
import { japanese } from './modules/japanese';

/**
 * 利用可能なカレンダーモジュールのレジストリ
 */
export const datePickerRegistry: Record<string, DatePickerModule> = {
  japanese: japanese,
  // 将来的に gregory: gregoryModule 等を追加可能
} as const;
