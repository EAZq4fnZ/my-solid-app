// src/components/ui/DatePicker/modules/japanese.ts
import { activeDateModule } from '@/lib/date'; // 共通の日付変換ライブラリ
import type { DatePickerModule } from '../core';
//import { DatePickerConfig } from '../types';

export const japanese: DatePickerModule = {
  calendarId: 'japanese',
  locale: 'ja-JP-u-ca-japanese',
  timeZone: 'Asia/Tokyo', // offset:+09:00
  inputPlaceholder: '2026/6/18',

  toFormat: (isoStr: string, template: string) => {
    // 共通ライブラリを介して和暦フォーマットを処理
    return activeDateModule.toFormat(isoStr, template);
  },
};
