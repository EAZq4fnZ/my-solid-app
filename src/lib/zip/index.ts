// src/lib/zip/index.ts
import { yubinbangoProvider } from './strategies/yubinbango-data';
import type { ZipProvider } from './types';

export { StAddrInfo, ZipCode } from './types';
export { useZip } from './useZip';

/**
 * 将来、デジタルアドレスAPIやzipcloudを追加したら、
 * ここで読み込んで activeProvider を差し替える
 */
const activeProvider: ZipProvider = yubinbangoProvider;

export const searchAddress = (zip: string) => activeProvider.fetchByZip(zip);

export const getZipSuggestions = (input: string) =>
  activeProvider.fetchSuggestions?.(input) ?? Promise.resolve([]);
