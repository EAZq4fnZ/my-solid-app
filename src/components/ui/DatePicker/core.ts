// src/components/ui/DatePicker/core.ts
import type { DatePickerConfig } from './types';

/** 暦モジュールが実装すべき共通契約 */
export interface DatePickerModule extends DatePickerConfig {
  // ISO形式の日付文字列を、特定のカレンダー形式（和暦等）に変換する関数
  toFormat: (isoStr: string, template: string) => string;
}
