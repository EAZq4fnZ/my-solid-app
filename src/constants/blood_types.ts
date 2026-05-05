// src/constants/blood_types.ts

// 値の定義
export const BLOOD_TYPE_MASTER = {
  A: 'A型',
  B: 'B型',
  AB: 'AB型',
  O: 'O型',
  unknown: '不明',
} as const;

// 型の定義
export type BloodTypeCode = keyof typeof BLOOD_TYPE_MASTER;

// バリデーション用（ark.enumに渡す用）
export const BLOOD_TYPE_CODES = Object.keys(
  BLOOD_TYPE_MASTER,
) as readonly BloodTypeCode[];

/*
 * UI Select用の選択肢（value-labelペアの配列）
 *  もしUI側で必要なら、以下のように生成できます。
 *  現時点ではpxSchema.ts内で直接ark.enumに渡す形にしているため、UI用の選択肢は定義していませんが、
 *  必要に応じて以下のコードを参考にしてください。
 *
 * export const BLOOD_TYPE_OPTIONS: { value: BloodTypeCode; label: string }[] =
 *   BLOOD_TYPE_CODES.map((key) => ({
 *     value: key,
 *     label: BLOOD_TYPE_MASTER[key],
 * }));
 */
export const BLOOD_TYPE_OPTIONS = BLOOD_TYPE_CODES.map((code) => ({
  value: code,
  label: BLOOD_TYPE_MASTER[code],
}));
