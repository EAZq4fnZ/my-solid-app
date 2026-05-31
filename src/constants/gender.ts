// src/constants/gender.ts
import { createMasterRegistry } from './factory';

// 性別コードの定義
const GENDER_RAW_MASTER = {
  male: '男性',
  female: '女性',
  other: 'その他',
  unknown: '－',
} as const;

// ファクトリーを使ってすべての資産を自動生成
export const GenderRegistry = createMasterRegistry(GENDER_RAW_MASTER);

// 型だけは個別に名前をつけてエクスポート（外部から使いやすくするため）
export type GenderCode = keyof typeof GENDER_RAW_MASTER;
