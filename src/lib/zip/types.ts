// src/lib/zip/types.ts

export interface StAddrInfo {
  // 基本情報
  fullAddress: string; // 結合済み住所
  addrParts: {
    zipCode: string; // 郵便番号 （例：123-4567）
    prefName: string; // 都道府県（例：東京都）
    cityName: string; // 市区町村（例：千代田区）
    townName: string; // 町域（例：霞が関）
    blockName?: string; // 丁目・番地・号（例：1丁目1-1）
  };
  // 拡張メタデータ（APIごとの生データを一時保持する場合）
  meta?: Record<string, any>;
}

// システム連携情報 後にmetaレコードに書き込む
/* dgaParts?: {
    dgaCode?: string; // システム連携用（デジタルアドレスAPI等から取得）

    prefCode?: string; // 都道府県コード（JISコード2桁）
    prefKana: string; // 都道府県名（カナ）
    prefRoma: string; // 都道府県名（ローマ字）
    cityCode?: string; // 自治体コード（JISコード5桁）
    cityKana: string; // 市区町村名（カナ）
    cityRoma: string; // 市区町村名（ローマ字）
    townKana: string; // 町域名（カナ）
    townRoma: string; // 町域名（ローマ字）

    bizName?: string; // 法人名
    bizKana?: string; // 法人名（カナ）
    bizRoma?: string; // 法人名（ローマ字）
  };

  // 位置情報（地図連携用）
  location?: {
    lat: number;
    lng: number;
  };
*/

// 成功か失敗かを明示するラップ型
export type ZipResult<T> =
  | { success: true; data: T; errMessage: null }
  | { success: false; data: null; errMessage: string }; // 'NOT_FOUND' | 'NETWORK_ERROR' 等

export interface ZipProvider {
  name: string;
  // 戻り値を型でラップする
  fetchByZip: (zip: string) => Promise<ZipResult<StAddrInfo | null>>;
  fetchSuggestions?: (input: string) => Promise<ZipResult<StAddrInfo[]>>;
}
