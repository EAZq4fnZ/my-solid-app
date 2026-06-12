// src/components/ui/DatePicker/index.tsx
import type { DatePickerModule } from './core';
import { japanese } from './modules/japanese';

export const datePickerRegistry: Record<string, DatePickerModule> = {
  japanese: japanese,
  // gregory: gregoryModule, もここに追加可能
} as const;
