// src/lib/zip/types.ts

/**
 * 郵便番号 ZipCode 型 (123-4567)
 * @see https://ja.wikipedia.org/wiki/%E9%83%B5%E4%BE%BF%E7%95%AA%E5%8F%B7
 */
export type ZipCode = string & { readonly __brand: unique symbol };

export const ZipCode = {
  /** ゆるい判定：全角・半角・ハイフンの有無に関わらず、数字7桁を抽出する */
  LOOSE_REGEX: /^([0-9０-９]{3})[-−ー－\s]?([0-9０-９]{4})$/,

  /** 厳格な判定：すでにシステム標準の「123-4567」の形になっているか */
  STRICT_REGEX: /^\d{3}-\d{4}$/,

  /**
   * ユーザーの入力（全角・ハイフンなし等）を半角・ハイフン付きの「123-4567」へクレンジングする
   * UIの onBlur ハンドラーや内部処理で行う
   * @param value 検証・変換 対象の文字列 例: "123-4567, 1234567"
   * @returns 郵便番号 string
   * @throws 郵便番号として成立しない文字列の場合にエラーを投げます
   */
  normalize(value: string): string {
    const cleaned = value
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[－−ー]/g, '-')
      .trim();

    const match = cleaned.match(this.LOOSE_REGEX);
    if (!match) return value; // 形式が崩れすぎている場合はそのまま戻してバリデーターに落とさせる

    const [, p1, p2] = match;
    return `${p1}-${p2}`;
  },

  /**
   * 渡された文字列を厳格な ZipCode 型に変換する
   * @param value 検証・変換 対象の文字列 例: "123-4567"
   * @returns 郵便番号 ZipCode 型
   * @throws 郵便番号として成立しない文字列の場合にエラーを投げます
   */
  fromRaw(value: string): ZipCode {
    const normalized = this.normalize(value);
    if (!this.STRICT_REGEX.test(normalized)) {
      throw new Error('郵便番号は数字7桁で入力してください');
    }
    return normalized as ZipCode;
  },

  /**
   * 渡された文字列がシステム公認の ZipCode 型（123-4567）を満たしているか判定する型ガード
   */
  isValid(value: string): value is ZipCode {
    return this.STRICT_REGEX.test(value);
  },
};

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
  fetchSuggestions?: (input: string) => Promise<ZipResult<StAddrInfo[]>>;
}

export interface ZipResult<T> {
  success: boolean;
  data: T | null;
  errMessage: string | null;
}
