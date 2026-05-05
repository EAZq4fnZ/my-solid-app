// src/features/px/schemas/pxSchema.ts
import type { Type } from 'arktype';
import { type } from 'arktype';

import { GENDER_CODES } from '@/constants/gender';
import type { Database } from '@/lib/database';
import { ark } from '@/lib/ark';

// 1. DBの型を抽出
export type PxRow = Database['public']['Tables']['px']['Row'];

// 2.性別コードの選択肢を定義
//ark.enum と GENDER_CODES を組み合わせて、性別コードのバリデーションを行います

/**
 * 3. ベースとなるバリデーション定義（全項目）
 */
const _pxBase = type({
  id: 'string',
  display_id: 'string',
  last_name: ark.required,
  first_name: ark.required,
  last_kana: ark.tozenkana.and('string>=1'),
  first_kana: ark.tozenkana.and('string>=1'),
  //gender_code: type.enumerated(...GENDER_OPTIONS.map((opt) => opt.value)),
  gender_code: ark.enum(GENDER_CODES),
  birthday: ark.date,
  tel: ark.tel.and('string>=1'), // 必須項目として最低限の長さを要求
  email: ark.email,
  zip: ark.zip,
  addr1: ark.required,
  addr2: ark.optional,
  job: ark.optional,
  created_at: 'string',
  updated_at: 'string',
});

// 基本スキーマと型
export const pxSchema = _pxBase;
//export type Px = typeof pxSchema.infer;

/**
 * 4. 用途別のスキーマ加工
 */

// 4.1 登録用 (Insert): DB自動生成項目を除外
export const pxInsertSchema = _pxBase.omit(
  'id',
  'display_id',
  'created_at',
  'updated_at',
);
export type PxInsert = typeof pxInsertSchema.infer;

// 4.2 更新用 (Update): 登録用をベースに全項目を任意(partial)に
export const pxUpdateSchema = pxInsertSchema.partial();
export type PxUpdate = typeof pxUpdateSchema.infer;

// 4.3 検索用 (Search): 全項目を任意に
export const pxSearchSchema = _pxBase.partial();
export type PxSearch = typeof pxSearchSchema.infer;

/**
 * 5. バリデーター生成ヘルパー
 * 特定の pxSchema ではなく、広義の ArkType (AnyType) を受け入れるように変更します
 */

const createValidator = (schema: Type) =>
  ({
    onChange: ({ value }: { value: any }) => {
      const out = schema(value);
      return out instanceof type.errors ? out.summary : undefined;
    },
  }) satisfies Record<string, (args: { value: any }) => string | undefined>;

/**
 * 6. エクスポート用バリデーター
 * フォームの用途に合わせてこれらを使い分けます
 */
export const pxValidators = createValidator(pxSchema); // 全項目用
export const pxInsertValidators = createValidator(pxInsertSchema); // 登録用
export const pxUpdateValidators = createValidator(pxUpdateSchema); // 更新用
export const pxSearchValidators = createValidator(pxSearchSchema); // 検索用

/**
 * 7. 初期値定義
 */
export const defaultPxValues: PxInsert = {
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
