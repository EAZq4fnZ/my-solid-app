// src/lib/date/index.ts
import { type } from 'arktype';

import type {
  EraFormatMode,
  IsoDateString,
  IsoDateTimeString,
} from '@/types/date';
import { uiRegistry } from './registry';

/** アクティブな日付モジュール（例: 和暦モジュール） */
export const activeDateModule = uiRegistry.japanese;

export const parseDate = (value: string) =>{}


export const parseDateTime = (value: string) =>{}


export const formatDate = (isoStr: string, mode?: EraFormatMode) =>{}


export const getToday =  () => {}

export const getNow =  () => {}


// --- ArkType パイプラインスキーマ（TanStack Form等の送信時バリデーション用） ---

/** ユーザーの自由な入力を、和暦も含めて安全に `IsoDateString` ブランド型へ昇格させる単一用スキーマ */
export const isoDateSchema = type('string').pipe((s, ctx) => {
  const result = parseDate(s);
  return result !== null ? result : ctx.error('invalid_date_format');
});

/** 複数選択された日付文字列の配列を、一括して `IsoDateString[]` に昇格させる複数用スキーマ */
export const multipleIsoDateSchema = type([isoDateSchema, '[]']);