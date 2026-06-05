// src/features/px/pxSchema.ts
import type { Type } from 'arktype';
import { type } from 'arktype';

import { genderCodeSchema } from '@/constants/gender';
import { ark } from '@/lib/ark';
import type { Database } from '@/lib/database';
import { isoDateSchema, isoDateTimeSchema } from '@/lib/date';
import { zipCodeSchema } from '@/lib/zip/core';

// pxテーブルの型を抽出
export type PxRow = Database['public']['Tables']['px']['Row'];

// ベースとなるバリデーション定義（全項目）
const _pxBase = type({
  id: 'string.uuid.v4', // テーブルの主キー:UUID
  display_id: 'string>=1', // 表示用ID:strnig
  last_name: ark.required, // 姓:string
  first_name: ark.required, // 名:string
  last_kana: ark.tozenkana.and('string>=1'), // 姓名(カナ):string
  first_kana: ark.tozenkana.and('string>=1'), //名(カナ):string
  gender_code: genderCodeSchema, // 性別コード constants/gender より
  birthday: isoDateSchema, // 生年月日:string (空文字許容)
  tel: ark.tel.and('string>=1'), // 必須項目として最低限の長さを要求
  email: 'string.email | null | undefined',
  zip: zipCodeSchema.or('""'), // 郵便番号 constants/zip から取得 (空文字許容)
  addr1: ark.required,
  addr2: ark.optional,
  job: ark.optional,
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
});

// 基本スキーマと型
export const pxSchema = _pxBase;
//export type Px = typeof pxSchema.infer;

// 登録用 (Insert): DB自動生成項目を除外
export const pxInsertSchema = _pxBase.omit(
  'id',
  'display_id',
  'created_at',
  'updated_at',
);
export type PxInsert = typeof pxInsertSchema.infer;

// 更新用 (Update): 登録用をベースにidを必須、他項目を任意に
export const pxUpdateSchema = pxInsertSchema
  .partial()
  .and({ id: 'string.uuid.v4' });
export type PxUpdate = typeof pxUpdateSchema.infer;

// 検索用 (Search): 全項目を任意に
export const pxSearchSchema = _pxBase.partial();
export type PxSearch = typeof pxSearchSchema.infer;

/**
 * バリデーター生成ヘルパー
 * 特定の pxSchema ではなく、広義の ArkType (AnyType) を受け入れるように変更します
 */

const createValidator = (schema: Type) =>
  ({
    onChange: ({ value }: { value: unknown }) => {
      const out = schema(value);
      return out instanceof type.errors ? out.summary : undefined;
    },
  }) satisfies Record<string, (args: { value: unknown }) => string | undefined>; // 型を厳格にキャスト

/**
 * エクスポート用バリデーター
 * フォームの用途に合わせてこれらを使い分けます
 */
export const pxValidators = {
  base: createValidator(pxSchema), // 全項目用
  insert: createValidator(pxInsertSchema), // 登録用
  update: createValidator(pxUpdateSchema), // 更新用
  search: createValidator(pxSearchSchema), // 検索用
};

// 初期値定義
export const defaultPxValues = {
  last_name: '',
  first_name: '',
  last_kana: '',
  first_kana: '',
  gender_code: 'unknown',
  birthday: '',
  tel: '',
  email: '',
  zip: '',
  addr1: '',
  addr2: '',
  job: '',
};
