// src/lib/date/index.ts
import { type } from 'arktype';

import type {
  EraFormatMode,
  IsoDateString,
  IsoDateTimeString,
} from '@/types/date';
import { dateTimeRegistry } from './registry';

/** アクティブな日付モジュール */
export const activeDateModule = dateTimeRegistry.japanese;

export const parseDate = (value: string) =>
  activeDateModule.fromRaw(value, 'date');

export const parseDateTime = (value: string) =>
  activeDateModule.fromRaw(value, 'datetime');

export const formatDate = (isoStr: string, mode?: EraFormatMode) =>
  activeDateModule.toDisplay(isoStr, mode);

export const getToday = (): IsoDateString => activeDateModule.today();

export const getNow = (): IsoDateTimeString => activeDateModule.now();

/**
 * 指定された日付文字列を、任意のカスタムテンプレート形式に変形します。
 * @param isoStr - パース可能な日付文字列
 * @param template - 置換テンプレート (例: 'YYYY', 'ENEYT')
 */
export const formatCustom = (isoStr: string, template: string): string => {
  return activeDateModule.toFormat(isoStr, template);
};

/** 任意の文字列が正しい日付型(IsoDateString)にパース可能か検証・変換するユーティリティ */
export const dateUtils = {
  isValid: (value: string): boolean => activeDateModule.isValid(value, 'date'),
  tryFromRaw: (value: string): IsoDateString | null =>
    activeDateModule.tryFromRaw(value, 'date'),
  fromParts: (y: number, mm: number, d: number,timezone: string,): IsoDateString | null => 
      activeDateModule.fromParts(y, mm, d, 0,0,0,timezone, 'date') as IsoDateString | null,
};

/** 任意の文字列が正しい日時型(IsoDateTimeString)にパース可能か検証・変換するユーティリティ */
export const dateTimeUtils = {
  isValid: (value: string): boolean =>
    activeDateModule.isValid(value, 'datetime'),
  tryFromRaw: (value: string): IsoDateTimeString | null =>
    activeDateModule.tryFromRaw(value, 'datetime'),
  fromParts: (y: number, mm: number, d: number,
    h: number, m: number, s: number, timezone: string): IsoDateTimeString | null => 
      activeDateModule.fromParts(y, mm, d, h, m, s, timezone, 'datetime') as IsoDateTimeString | null,
};

// --- ArkType パイプラインスキーマ（TanStack Formなどのバリデーション用） ---
/** ユーザーの自由な入力を、和暦も含めて安全に `IsoDateString` ブランド型へ昇格させるスキーマ */
export const isoDateSchema = type('string').pipe((s, ctx) => {
  const result = dateUtils.tryFromRaw(s);
  if(result) return result as IsoDateString;
  return ctx.error('正しい日付を入力してください(例: 2026/05/31)');
});

/** ユーザーの自由な入力を、安全に `IsoDateTimeString` ブランド型へ昇格させるスキーマ */
//
export const isoDateTimeSchema = type('string').pipe((s, ctx) => {
  const result = dateTimeUtils.tryFromRaw(s);
  if(result) return result as IsoDateTimeString;
  return ctx.error('正しい日時を入力してください(例: 2026/05/31 14:30)');
});
