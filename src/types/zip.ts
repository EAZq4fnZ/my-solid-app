// src/lib/zip/types.ts
import { normalizeJapaneseInput } from '@/utils/string';

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
   * ユーザーの入力（全角・ハイフンなし等）を
   * 　半角・ハイフン付きの「123-4567」へクレンジングする
   * UIの onBlur ハンドラーや string -> ZipCode への昇格処理に使う
   * @param value string 検証・変換 対象の文字列 例: "123-4567, １２３４５６７"
   * @returns string 郵便番号 例:"123-4567"
   */
  normalize(value: string): string {
    const cleaned = normalizeJapaneseInput(value)
      .replace(/[－−ー]/g, '-')
      .trim();
    const match = cleaned.match(this.LOOSE_REGEX); // 形式が崩れすぎている場合は
    if (!match) return value; // そのまま返し、各コンポーネントのバリデータ や isValid で落とさせる

    const [, p1, p2] = match;
    return `${p1}-${p2}`;
  },

  /**
   * 渡された文字列を厳格な ZipCode 型に変換する
   * @param value string 検証・変換 対象の文字列 例: "123-4567"
   * @returns ZipCode型 郵便番号
   * @throws 郵便番号として成立しない文字列の場合にエラーを投げます
   */
  fromRaw(value: string): ZipCode {
    const result = this.tryFromRaw(value);
    if (!result) {
      throw new Error('郵便番号は "123-4567" 形式で入力してください');
    }
    return result;
  },

  /**
   * 渡された文字列を厳格な ZipCode 型に変換
   * 変換できない場合は throw new error せずに null を返す
   * @param value 検証・変換 対象の文字列 例: "123-4567" string
   * @returns 郵便番号 ZipCode 型 または null
   *
   */
  tryFromRaw(value: string): ZipCode | null {
    if (ZipCode.isValid(value)) return value; // 妥当な場合はそのまま返す

    const normalized = this.normalize(value); // 文字列を正規化
    if (ZipCode.isValid(normalized)) return normalized; // 正規化した文字列を再検証して返す

    return null; // 変換できない場合 null を返す
  },

  /**
   * 渡された文字列がシステム公認の ZipCode 型（123-4567）を満たしているか判定する型ガード
   */
  isValid(value: string): value is ZipCode {
    return this.STRICT_REGEX.test(value);
  },
};
