// src/constants/blood_types.ts
import { createMasterRegistry } from './factory';

// 値の定義
const BLOOD_TYPE_RAW_MASTER = {
  A: 'A型',
  B: 'B型',
  AB: 'AB型',
  O: 'O型',
  unknown: '不明',
} as const;

// ファクトリーを使ってすべての資産を自動生成
export const BloodTypeRegistry = createMasterRegistry(BLOOD_TYPE_RAW_MASTER);

// 型だけは個別に名前をつけてエクスポート（外部から使いやすくするため）
export type BloodType = keyof typeof BLOOD_TYPE_RAW_MASTER;
