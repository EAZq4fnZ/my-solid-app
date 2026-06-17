// src/components/ui/DatePicker/modules/japanese.ts
import type { DatePickerModule } from '../core';
import { activeDateModule } from '@/lib/date'; // 共通の日付変換ライブラリ
import { DatePickerConfig } from '../types';

export const japanese: DatePickerConfig = {
  calendarId: 'japanese',
  locale: 'ja-JP-u-ca-japanese',
  timeZone: 'Asia/Tokyo',
  inputPlaceholder: '日付を入力 (例: 令和6年1月1日)',

  toFormat: (isoStr: string, template: string) => {
    // 共通ライブラリを介して和暦フォーマットを処理
    return activeDateModule.toFormat(isoStr, template);
  },
};
