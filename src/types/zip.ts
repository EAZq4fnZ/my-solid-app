// src/lib/zip/types.ts

/**
 * 郵便番号 ZipCode 型 (123-4567)
 * @see https://ja.wikipedia.org/wiki/%E9%83%B5%E4%BE%BF%E7%95%AA%E5%8F%B7
 */
export type ZipCode = string & { readonly __brand: unique symbol };

export interface StAddrInfo {
  fullAddress: string;
  addrParts: {
    zipCode: ZipCode; // 住所の郵便番号 123-4567
    prefName: string; // 都道府県名
    cityName: string; // 市区町村名
    townName: string; // 町域名
    street?: string; // 通り (存在しない場合は undefined)
  };
  // biome-ignore lint/suspicious/noExplicitAny: 外部APIからの動的なメタデータを保持するため意図的に any を使用
  meta?: Record<string, any>;
}

export interface ZipResult<T> {
  success: boolean; // true: 成功, false: 失敗
  data: T | null; // 成功時の返却値、StAddrInfo または StAddrInfo[]
  errMessage: string | null; // 失敗時のメッセージ
}

/**
 * プロバイダが実装すべき生データ取得の型定義
 * 外部通信(fetch)やモックデータのパースはすべてこの関数の中に閉じ込めます
 */
export type RawZipDataFetcher = (
  zip: string,
) => Promise<Record<string, string[]> | null>;

/**
 * 共通コアが外部へ提供する公開インターフェース
 */
export interface ZipModule {
  readonly providerName: string;
  fetchByZip(zip: string): Promise<ZipResult<StAddrInfo>>;
  fetchSuggestions(input: string): Promise<ZipResult<StAddrInfo[]>>;
}

export interface ZipModuleConfig {
  providerName: string;
  resolveAddress: RawZipDataFetcher;
}
