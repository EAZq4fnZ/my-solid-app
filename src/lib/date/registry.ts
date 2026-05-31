// src/lib/date/registry.ts
import type { DateTimeModule, EraInfo } from '@/types/date';
import { createDateTimeModule } from './core';
import {
  fetchJapaneseEraInfo,
  parseJapaneseRawText,
} from './providers/japanese';

const ISO_WEEK_DAYS = [
  { name: '', abbr: '' }, // 0番目（ダミー）
  { name: 'Monday', abbr: 'Mon' }, // 1 (月曜日)
  { name: 'Tuesday', abbr: 'Tue' }, // 2 (火曜日)
  { name: 'Wednesday', abbr: 'Wed' }, // 3 (水曜日)
  { name: 'Thursday', abbr: 'Thu' }, // 4 (木曜日)
  { name: 'Friday', abbr: 'Fri' }, // 5 (金曜日)
  { name: 'Saturday', abbr: 'Sat' }, // 6 (土曜日)
  { name: 'Sunday', abbr: 'Sun' }, // 7 (日曜日)
] as const;

/**
 * 各暦・タイムゾーンごとに設定された、DateTimeModuleの実体名簿（レジストリ）
 */
export const dateTimeRegistry: Record<string, DateTimeModule> = {
  // 日本国内向けの標準和暦モジュール (東京タイムゾーン)
  japanese: createDateTimeModule({
    calendarId: 'japanese',
    timezone: 'Asia/Tokyo',
    parser: parseJapaneseRawText,
    fetchEraInfo: fetchJapaneseEraInfo, // DIによる関数注入
  }),

  // 標準の西暦(ISO8601)モジュール（比較・防衛・拡張用）
  iso8601: createDateTimeModule({
    calendarId: 'iso8601',
    timezone: 'Asia/Tokyo',
    parser: (text) => {
      const nums = text.split(/\D+/).filter(Boolean).map(Number);
      return {
        year: nums[0] ?? null,
        month: nums[1] ?? null,
        day: nums[2] ?? null,
        timeParts: [nums[3] ?? null, nums[4] ?? null, nums[5] ?? null],
      };
    },
    fetchEraInfo: (parts) =>
      ({
        ...parts,
        eraName: '',
        eraAbbr: '',
        eraYearText: String(parts.year),
        monthText: String(parts.month).padStart(2, '0'),
        monthAbbrText: String(parts.month).padStart(2, '0'),
        dayText: String(parts.day).padStart(2, '0'),
        dayOfWeekText: ISO_WEEK_DAYS[parts.dayOfWeek]?.abbr ?? '',
      }) as EraInfo,
  }),
};
