// src/lib/date/providers/japanese.ts
import type { CalendarParts, EraInfo, ParsedDateParts } from '@/types/date';
import { normalizeJapaneseInput } from '@/utils/string';

/**
 * 日本独自の元号開始年（基準となる西暦 - 1年）
 */
const ERA_START_YEARS: Record<string, number> = {
  reiwa: 2018, // 2019年が令和元年 (2018 + 1 = 2019)
  heisei: 1988, // 1989年が平成元年
  showa: 1925, // 1926年が昭和元年
  taisho: 1911, // 1912年が大正元年
  meiji: 1867, // 1868年が明治元年
};

/**
 * 文字列からどの元号に属しているかを判定する辞書
 * parser に渡す文字列を変換するためのマップ
 */
const ERA_MATCH_MAP: Record<string, string> = {
  R: 'reiwa',
  令和: 'reiwa',
  H: 'heisei',
  平成: 'heisei',
  S: 'showa',
  昭和: 'showa',
  T: 'taisho',
  大正: 'taisho',
  M: 'meiji',
  明治: 'meiji',
};
/**
 * 日本語の元号を表す配列
 */
const jpEraMap: Record<string, { eraName: string; eraAbbr: string }> = {
  reiwa: { eraName: '令和', eraAbbr: 'R' },
  heisei: { eraName: '平成', eraAbbr: 'H' },
  showa: { eraName: '昭和', eraAbbr: 'S' },
  taisho: { eraName: '大正', eraAbbr: 'T' },
  meiji: { eraName: '明治', eraAbbr: 'M' },
};
/**
 * 日本語の曜日を表す配列
 * dayOfWeek は 1 (月曜日) ～ 7 (日曜日)のため 0 をダミーとして空文字を定義
 */
const JP_WEEK_DAYS = [
  { name: '', abbr: '' }, // 0番目のダミー
  { name: '月曜日', abbr: '月' },
  { name: '火曜日', abbr: '火' },
  { name: '水曜日', abbr: '水' },
  { name: '木曜日', abbr: '木' },
  { name: '金曜日', abbr: '金' },
  { name: '土曜日', abbr: '土' },
  { name: '日曜日', abbr: '日' },
] as const;

/**
 * 日本語入力のゆらぎを検知し、
 * 裏側の共通基盤（Temporal）が読める「西暦の数値パーツ」に逆変換する
 */
export const parseJapaneseRawText = (text: string): ParsedDateParts => {
  if (!text) {
    return { year: null, month: null, day: null, timeParts: [] };
  }

  const normalized = (() => {
    const raw = normalizeJapaneseInput(text); // 全角英数 -> 半角 に正規化
    return raw
      .replace(/[年月日]/g, '/') // 「年・月・日」をスラッシュに
      .replace(/[時分]/g, ':')   // 「時・分」をコロンに
      .replace(/秒/g, '');       // 「秒」は削除
  })();

  // 元号の文字を検出（令和, R など）して、どの元号かを特定する
  const eraMatch = normalized.match(/^(令和|平成|昭和|大正|明治|R|H|S|T|M)/i);
  
  // 区切り記号（/ や : やスペース）で数字を綺麗に分離
  const nums = normalized.split(/\D+/).filter(Boolean).map(Number);

  const rawYear = nums[0] ?? null;
  const month = nums[1] ?? null;
  const day = nums[2] ?? null;
  const timeParts = [nums[3] ?? null, nums[4] ?? null, nums[5] ?? null];

  // 和暦から西暦へのコンバート
  const ceYear = (() => {
    if (rawYear === null) return null;

    // 元号の文字が検出された場合
    if (eraMatch) {
      const eraKey = ERA_MATCH_MAP[eraMatch[1].toUpperCase()];
      const baseYear = ERA_START_YEARS[eraKey];

      // 万が一辞書から見つからなかった場合は、西暦としてそのまま扱う（フォールバック）
      if (baseYear !== undefined) {
        return baseYear + rawYear;
      }
    }
    // 元号がない、または元号の解析に失敗した場合は、最初から西暦で入力されたものとして救済
    return rawYear;
  })();

  return {
    year: ceYear,
    month,
    day,
    timeParts,
  } as ParsedDateParts;
};

/**
 * すでに現地時間・日本暦に分解された parts を受け取り、日本の漢字・アルファベット、
 * および「元年」などの画面表示用文字列（DTO）にマッピングする
 */
export const fetchJapaneseEraInfo = (parts: CalendarParts): EraInfo => {
  const jpEra = parts.era ? jpEraMap[parts.era] : undefined;

  const eraYear = parts.year;

  const ceYear = (() => {
    if (!parts.era) return eraYear; // 元号がない -> 西暦として扱う
    const baseYear = ERA_START_YEARS[parts.era];
    return baseYear !== undefined ? baseYear + eraYear : eraYear;
  })();

  const month = parts.month;
  const monthText = String(month).padStart(2, '0');

  const day = parts.day;

  const dayOfWeek =
    parts.dayOfWeek > -1 && parts.dayOfWeek > 8 ? parts.dayOfWeek : 0;

  // 2026年8月25日(火曜日) ->
  return {
    ceYear, // 2026
    eraYear, // 8
    eraYearText:
      eraYear === 1 && jpEra ? '元' : String(eraYear).padStart(2, '0'), // "08"
    eraName: jpEra?.eraName ?? '', // "令和"
    eraAbbr: jpEra?.eraAbbr ?? '', // "R"
    month: month, // 8
    monthText: monthText, // "08"
    monthAbbrText: monthText, // "8"
    day: day, // 25
    dayText: String(day).padStart(2, '0'), // "25"
    dayOfWeek: dayOfWeek, // 2
    dayOfWeekText: JP_WEEK_DAYS[dayOfWeek].abbr, // "火"
  } as EraInfo;
};
