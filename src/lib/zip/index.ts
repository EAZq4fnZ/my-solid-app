// src/lib/zip/index.ts
import { zipRegistry } from './registry';

export { zipUtils, zipCodeSchema } from './core';
export { zipRegistry } from './registry';
export { useZip } from './useZip';

export type { StAddrInfo, ZipResult, ZipModule } from '@/types/zip';

/** アクティブな日付モジュール */
export const activeZipModule = zipRegistry.yubinbango;

// 既存のロジックをアクティブなモジュール経由に一新
export const searchAddress = (zip: string) => activeZipModule.fetchByZip(zip);

export const getZipSuggestions = (input: string) =>
  activeZipModule.fetchSuggestions(input);
