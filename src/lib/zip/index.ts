// src/lib/zip/index.ts

// 実際のロジック（サービス関数）
import { yubinbangoProvider } from './strategies/yubinbango-data';
import type { ZipProvider } from './type';

export { ZipCode } from '@/types/zip'; // コアとなるドメイン型の再エクスポート
export type { StAddrInfo, ZipProvider, ZipResult } from './type'; // この機能モジュールが扱う住所やプロバイダーの型を一括提供
export { useZip } from './useZip'; // SolidJS用のカスタムHooks

/**
 * 将来、デジタルアドレスAPIやzipcloud を@/lib/zip/strategies に追加したら、
 * ここで読み込んで activeProvider を差し替える
 */
const activeProvider: ZipProvider = yubinbangoProvider;

export const searchAddress = (zip: string) => activeProvider.fetchByZip(zip);

export const getZipSuggestions = (input: string) =>
  activeProvider.fetchSuggestions?.(input) ??
  Promise.resolve({ success: true, data: [], errMessage: null });
