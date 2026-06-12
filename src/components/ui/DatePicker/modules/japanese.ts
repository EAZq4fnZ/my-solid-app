// src/components/ui/DatePicker/modules/japanese.ts
import type { DatePickerModule } from '../core';

export const japanese: DatePickerModule = {
  calendarId: 'japanese',
  locale: 'ja-JP-u-ca-japanese',
  timeZone: 'Asia/Tokyo',
  inputPlaceholder: '日付を入力',
  toFormat: (isoStr: string, template: string) => {
    /* ロジック */ return '';
  },
};
