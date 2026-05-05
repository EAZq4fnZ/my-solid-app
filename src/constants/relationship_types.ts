// src/constants/relationship_types.ts

// 値の定義
export const RELATIONSHIP_TYPES = {
  self: '本人', // 本人
  spouse: '配偶者', // 配偶者
  child: '子供', // 子供
  parent: '親', // 親
  sibling: '兄弟姉妹', // 兄弟姉妹
  other: 'その他', // その他
} as const;

// 型の定義
export type RelationshipType = keyof typeof RELATIONSHIP_TYPES;

// バリデーション用（ark.enumに渡す用）
export const RELATIONSHIP_TYPE_CODES = Object.keys(
  RELATIONSHIP_TYPES,
) as readonly RelationshipType[];

/*
 * UI Select用の選択肢（value-labelペアの配列）
 *  もしUI側で必要なら、以下のように生成できます。
 * 現時点ではpxSchema.ts内で直接ark.enumに渡す形にしているため、UI用の選択肢は定義していませんが、
 * 必要に応じて以下のコードを参考にしてください。
 *
 * export const RELATIONSHIP_TYPE_OPTIONS: { value: RelationshipType; label: string }[] =
 *   RELATIONSHIP_TYPE_CODES.map((key) => ({
 *     value: key,
 *     label: RELATIONSHIP_TYPE_LABELS[key],
 *   })),
 * );
 */
