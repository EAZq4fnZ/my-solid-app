// src/components/ui/DatePicker/modules/core.ts
import type { ModuleConfig } from './types';

/**
 * 暦モジュールが実装すべき共通契約
 * lib/zip の ZipModule に相当します
 */
export interface DatePickerModule extends ModuleConfig {
  // 必要に応じて、フォーマット関数などをここに追加
  toFormat: (isoStr: string, template: string) => string;
}
