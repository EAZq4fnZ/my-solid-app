// src/lib/date/index.ts
import { BaseOptions } from 'solid-js/types/reactive/signal.js';
import type { FieldProps } from '../Field';
import { EraDatePickerProps } from './types';

export const createEraProps = (
  fieldProps: FieldProps,
  baseOptions: BaseOptions,
  moduleConfig: ModuleConfig,
  overrideProps: OverrideProps,
): EraDatePickerProps => {
  return {
    ...fieldProps,
    ...baseOptions,
    ...moduleConfig,
    ...overrideProps,
  };
};

// --- ArkType パイプラインスキーマ（TanStack Form等の送信時バリデーション用） ---
// TODO: src/lib/date/index.ts にも定義済み、どうすれば良いか後で検討

/** ユーザーの自由な入力を、和暦も含めて安全に `IsoDateString` ブランド型へ昇格させる単一用スキーマ */
/*export const isoDateSchema = type('string').pipe((s, ctx) => {
  const result = null;
  return result !== null ? result : ctx.error('invalid_date_format');
});*/

/** 複数選択された日付文字列の配列を、一括して `IsoDateString[]` に昇格させる複数用スキーマ */
//export const multipleIsoDateSchema = type([isoDateSchema, '[]']);
