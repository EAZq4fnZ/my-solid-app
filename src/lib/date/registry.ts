// src/lib/date/registry.ts
import type { DateTimeModule, EraInfo } from '@/types/date';
import { createDateTimeModule } from './core';
import {
  fetchJapaneseEraInfo,
  parseJapaneseRawText,
} from './providers/japanese';
import { fetchIdo8601EraInfo, parseIso8601RawText } from './providers/iso8601';


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
    timezone: 'UTC',
    parser: parseIso8601RawText,
    fetchEraInfo: fetchIdo8601EraInfo,
  }),
};
