// src/constants/relationship_types.ts

import { createMasterRegistry } from './factory';

// 値の定義
const RELATIONSHIP_RAW_MASTER = {
  self: '本人', // 本人
  spouse: '配偶者', // 配偶者
  child: '子供', // 子供
  parent: '親', // 親
  sibling: '兄弟姉妹', // 兄弟姉妹
  other: 'その他', // その他
} as const;

// ファクトリーを使ってすべての資産を自動生成
export const RelationshipRegistry = createMasterRegistry(
  RELATIONSHIP_RAW_MASTER,
);

// 型だけは個別に名前をつけてエクスポート（外部から使いやすくするため）
export type RelationshipType = keyof typeof RELATIONSHIP_RAW_MASTER;
