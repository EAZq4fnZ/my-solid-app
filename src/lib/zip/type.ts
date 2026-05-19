// src/lib/zip/type.ts
import type { ZipCode } from '@/types/zip';

/**
 * 住所情報 interface StAddrInfo
 * -fullAddress: 住所全体 string
 * -zipCode: 郵便番号 ZipCode 型
 * -prefName: 都道府県名
 * -cityName: 市区町村名
 * -townName: 町域名
 * -blockName: 建物名
 * -meta: 外部APIから取得した住所情報のメタデータ
 * (外部APIから取得したものを保持するため意図的に any を使用)
 */
export interface StAddrInfo {
  fullAddress: string;
  addrParts: {
    zipCode: ZipCode; // 郵便番号 ZipCode 型
    prefName: string;
    cityName: string;
    townName: string;
    blockName?: string;
  };
  // biome-ignore lint/suspicious/noExplicitAny: 外部APIからの動的なメタデータを保持するため意図的に any を使用
  meta?: Record<string, any>;
}

// interface ZipProvider
export interface ZipProvider {
  name: string;
  fetchByZip: (zip: string) => Promise<ZipResult<StAddrInfo>>;
  fetchSuggestions: (input: string) => Promise<ZipResult<StAddrInfo[]>>;
}

export interface ZipResult<T> {
  success: boolean;
  data: T | null;
  errMessage: string | null;
}
