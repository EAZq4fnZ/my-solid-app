// src/types/date/type.ts

// Temporalとの互換性やsupabaseの日付・時刻型に対応するためのブランド型定義
export type IsoDateString = string & { readonly __brand: unique symbol };
export type IsoDateTimeString = string & { readonly __brand: unique symbol };

/**
 * 定型表示用のフォーマットモード
 */
export enum EraFormatMode {
  Ymd = 'Ymd', // 西暦標準(スラッシュ): YYYY/MM/DD
  YmdDash = 'YmdDash', // 西暦(ダッシュ): YYYY-MM-DD
  Full = 'Full', // 西暦(和暦)併記スラッシュ: YYYY(ENEY)/MM/DD
  Abbr = 'Abbr', // 和暦略称スラッシュ: EAEY/MM/DD (例: R8/05/25)
  Tiny = 'Tiny', // 和暦年数字のみスラッシュ: EY/MM/DD (例: 8/05/25)
  Jp = 'Jp', // 日本語和暦フル表記: ENEY年MM月DD日 (例: 令和8年05月25日)
}

/**
 * 共通側から各国プロバイダへ引き渡される、現地時間適用・パース済みのプレーンな数字パーツ
 */
export interface CalendarParts {
  ceYear: number; // 常に西暦の4桁年 (例: 2026)
  era: string | undefined; // Temporalが判定した生のEra識別子 (例: "reiwa")
  eraYear: number; // 暦ごとの年 (例: 令和8年なら 8, 仏暦2569年なら 2569)
  year: number; // カレンダー年 (通常はeraYearと同じ)
  month: number; // 月 (1〜12)
  day: number; // 日 (1〜31)
  hour: number; // 時 (0〜23)
  minute: number; // 分 (0〜59)
  second: number; // 秒 (0〜59)
  dayOfWeek: number; // 曜日 (0〜6)
}

/**
 * 各国プロバイダが翻訳して共通側に返す、最終表現カタログ（DTO）
 */
export interface EraInfo extends CalendarParts {
  eraName: string; // 元号・紀元 "令和", "ヒジュラ暦"
  eraAbbr: string; // 元号・紀元のアルファベット略称 "R", "AH"
  eraYearText: string; // 元号年 "元", "02" (日本の元年対応など)
  monthText: string; // 月 "05", "ラマダーン", "May", "閏5月"
  monthAbbrText: string; // 月 "05", "Ram.", "May"
  dayText: string; // 日 "25", "25th"
  dayOfWeekText: string; // "月曜日", "Monday", "Mon"
}

export type EraInfoFetcher = (parts: CalendarParts) => EraInfo;

export interface ParsedDateParts {
  year: number | null;
  month: number | null;
  day: number | null;
  timeParts: (number | null)[];
}

export interface DateProviderConfig {
  calendarId: string;
  timezone: string;
  parser: (text: string) => ParsedDateParts;
  fetchEraInfo: EraInfoFetcher;
}

export interface DateTimeModule {
  readonly timezone: string;
  readonly calendarId: string;

  /** ゆるい入力文字列を「YYYY-MM-DD」または「YYYY-MM-DDTHH:mm:ss」の標準形に整える */
  normalize(value: string): string;

  /** 安全な型昇格：失敗した場合は例外を投げず null を返す */
  tryFromRaw(value: string, mode: 'date'): IsoDateString | null;
  tryFromRaw(value: string, mode: 'datetime'): IsoDateTimeString | null;
  tryFromRaw(
    value: string,
    mode: 'date' | 'datetime',
  ): IsoDateString | IsoDateTimeString | null;

  /** 厳格な型昇格：失敗した場合は明確な Error をスローする */
  fromRaw(value: string, mode: 'date'): IsoDateString;
  fromRaw(value: string, mode: 'datetime'): IsoDateTimeString;
  fromRaw(
    value: string,
    mode: 'date' | 'datetime',
  ): IsoDateString | IsoDateTimeString;

  toDisplay: (isoStr: string, mode?: EraFormatMode) => string;
  toFormat: (isoStr: string, template: string) => string;

  /** 本日、現在時刻に対応する IsoDateString,IsoDateTimeString を返す */
  today: () => IsoDateString;
  now: () => IsoDateTimeString;

  isValid: (value: string, mode: 'date' | 'datetime') => boolean;
}
