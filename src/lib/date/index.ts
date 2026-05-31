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

/** 任意の文字列が正しい日付型(IsoDateString)にパース可能か検証・変換するユーティリティ */
export const dateUtils = {
  isValid: (value: string): boolean => activeDateModule.isValid(value, 'date'),

  tryFromRaw: (value: string): IsoDateString | null =>
    activeDateModule.tryFromRaw(value, 'date'),
};

/**
 * 任意の文字列が正しい日時型(IsoDateTimeString)にパース可能か検証・変換するユーティリティ
 */
export const dateTimeUtils = {
  isValid: (value: string): boolean =>
    activeDateModule.isValid(value, 'datetime'),

  tryFromRaw: (value: string): IsoDateTimeString | null =>
    activeDateModule.tryFromRaw(value, 'datetime'),
};

// --- ArkType パイプラインスキーマ（TanStack Formなどのバリデーション用） ---

/**
 * ユーザーの自由な入力を、和暦も含めて安全に `IsoDateString` ブランド型へ昇格させるスキーマ
 */
export const isoDateSchema = type([
  'string',
  '=>',
  (s) =>
    dateUtils.tryFromRaw(s) ??
    '正しい日付を入力してください(例: 2026/05/31, 令和8年5月31日)',
]);

/**
 * ユーザーの自由な入力を、安全に `IsoDateTimeString` ブランド型へ昇格させるスキーマ
 */
export const isoDateTimeSchema = type([
  'string',
  '=>',
  (s) => dateTimeUtils.tryFromRaw(s) ?? '正しい日時を入力してください',
]);
