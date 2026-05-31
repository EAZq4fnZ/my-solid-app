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

  // 既存のjaconvベースの共通ユーティリティで一括クレンジング（トリム＆全角半角の標準化）
  let normalized = normalizeJapaneseInput(text);

  // 「元年」を「1年」に安全に置換
  normalized = normalized.replace(/元年/g, '1');

  // 先頭の元号テキスト・記号を切り出す (例: "R8.5.25" ➔ "R" と "8.5.25")
  const eraRegex = /^(令和|平成|昭和|大正|明治|[RHSMT])/i;
  const eraMatch = normalized.match(eraRegex);

  // 3. 数字の部分だけを抽出して数値配列化
  const digitsOnly = normalized.replace(eraRegex, '');
  const nums = digitsOnly.split(/\D+/).filter(Boolean).map(Number);

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

  // 元号付 & 1年なら「元」年、それ以外は2桁パディング
  const EYT =
    parts.eraYear === 1 && jpEra
      ? '元'
      : String(parts.eraYear).padStart(2, '0');
  const MT = String(parts.month).padStart(2, '0');
  const DT = String(parts.day).padStart(2, '0');
  const DWT = JP_WEEK_DAYS[parts.dayOfWeek]?.abbr ?? '';

  return {
    ...parts,
    eraName: jpEra?.eraName ?? '',
    eraAbbr: jpEra?.eraAbbr ?? '',
    eraYearText: EYT,
    monthText: MT,
    monthAbbrText: MT,
    dayText: DT,
    dayOfWeekText: DWT,
  } as EraInfo;
};
