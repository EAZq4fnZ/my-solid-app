// src/components/ui/DatePicker/modules/japanese.ts
import type { DatePickerModule } from '../core';
import { activeDateModule } from '@/lib/date';

export const japanese: DatePickerModule = {
  calendarId: 'japanese',
  locale: 'ja-JP-u-ca-japanese',
  timeZone: 'Asia/Tokyo',
  inputPlaceholder: '日付を入力',
  toFormat: (isoStr: string, template: string) => {
    return activeDateModule.toFormat(isoStr, template);
  },
};
