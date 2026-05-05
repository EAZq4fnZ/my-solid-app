// 値の定義
export const GENDER_MASTER = {
  male: '男性',
  female: '女性',
  other: 'その他',
  unknown: '－',
} as const;

// 型の定義
export type GenderCode = keyof typeof GENDER_MASTER;

// バリデーション用（ark.enumに渡す用）
export const GENDER_CODES = Object.keys(GENDER_MASTER) as readonly GenderCode[];

/*
 * UI Select用の選択肢（value-labelペアの配列）
 *  もしUI側で必要なら、以下のように生成できます。
 *  現時点ではpxSchema.ts内で直接ark.enumに渡す形にしているため、UI用の選択肢は定義していませんが、
 *  必要に応じて以下のコードを参考にしてください。
 * export const GENDER_OPTIONS: { value: GenderCode; label: string }[] = GENDER_CODES.map((key) => ({
 *   value: key,
 *   label: GENDER_MASTER[key],
 * }));
 */
export const GENDER_OPTIONS = GENDER_CODES.map((code) => ({
  value: code,
  label: GENDER_MASTER[code],
}));
