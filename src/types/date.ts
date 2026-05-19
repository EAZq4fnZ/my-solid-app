// src/types/date.ts
import { Temporal } from '@js-temporal/polyfill';

import { normalizeJapaneseInput } from '@/utils/string';

export type IsoDateString = string & { readonly __brand: unique symbol };

export const IsoDateString = {
  /** 厳格なISO 8601形式（YYYY-MM-DD）の判定 */
  STRICT_REGEX: /^\d{4}-\d{2}-\d{2}$/,

  /**
   * ユーザーの入力（全角・ハイフンなし等）を
   * 　半角・ハイフン付きの「yyyy-mm-dd」へクレンジングする
   * UIの onBlur ハンドラーや string -> IsoDateString への昇格処理に使う
   * @param value string 検証・変換 対象の文字列 例: "2026-05-11"
   * @returns string 日付文字列 例:"2026-05-11"
   */
  normalize(value: string): string {
    const normalized = normalizeJapaneseInput(value) // 全角英数を半角に変換
      .trim()
      .replace(/年/g, '-') // 日本語の「年」「月」を「-」に置換し、「日」を消去
      .replace(/月/g, '-')
      .replace(/日/g, '')
      .replace(/[\/／－−ー－\s]/g, '-'); // 日本語の「/」「-」「空白」を「-」に置換

    return /^\d{8}$/.test(normalized) // 8桁の数字ならハイフン区切りに変換
      ? `${normalized.slice(0, 4)}-${normalized.slice(4, 6)}-${normalized.slice(6, 8)}`
      : normalized;
  },

  /**
   * 渡された文字列を厳格な IsoDateString 型に変換する
   * @param value string 検証・変換 対象の文字列 例: "2026-05-11"
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11")
   * @throws 変換できない文字列や不正な日付の場合にエラーを投げます
   */
  fromRaw(value: string): IsoDateString {
    const result = this.tryFromRaw(value);
    if (!result)
      throw new Error('有効な日付形式で入力してください "yyyy/mm/dd"');
    return result;
  },

  /**
   * 渡された文字列を厳格な IsoDateString 型に変換
   * 変換できない場合は throw new error せずに null を返す
   * @param value 検証・変換 対象の文字列 例: "2026-05-11"
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11") または null
   *
   */
  tryFromRaw(value: string): IsoDateString | null {
    if (IsoDateString.isValid(value)) return value; // 妥当な場合はそのまま返す

    const normalized = this.normalize(value); // ハイフン区切りの日付に変換して検証させる
    try {
      const date = Temporal.PlainDate.from(normalized); // Temporal を使い 日付型に変換を試み有効な日付かを検証

      return date.toString() as IsoDateString; // 変換後の日付が妥当な場合はそのまま返す
    } catch {
      return null; // 変換できない場合 null を返す
    }
  },

  /**
   * 渡された文字列がシステム公認の IsoDateString 型（yyyy-mm-dd）を満たしているか判定する型ガード
   */
  isValid(value: string): value is IsoDateString {
    return this.STRICT_REGEX.test(value);
  },
};

export type IsoDateTimeString = string & { readonly __brand: unique symbol };

export const IsoDateTimeString = {
  /** DB（Supabase）から返ってくる代表的なISO 8601日時形式の正規表現 */
  STRICT_REGEX:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,

  /**
   * ユーザーの入力（全角・ハイフンなし等）を
   * 　半角・ハイフン付きの「yyyy-mm-dd hh:mm:ss」へクレンジングする
   * UIの onBlur ハンドラーや string -> IsoDateTimeString への昇格処理に使う
   * @param value string 検証・変換 対象の文字列 例: "2026-05-11 12:34:56"
   * @returns string 日付文字列 例:"2026-05-11T12:34:56"
   */
  normalize(value: string): string {
    const normalized = normalizeJapaneseInput(value)
      .trim() // 前後の空白を除去
      .replace(/年/g, '-') // 日本語の「年」「月」を「-」に置換し、「日」を消去
      .replace(/月/g, '-')
      .replace(/日/g, '')
      .replace(/時/g, ':') // 日本語の「時」「分」を「:」に置換し、「秒」を消去
      .replace(/分/g, ':')
      .replace(/秒/g, '')
      .replace(/[\/／]/g, '-') // スラッシュを「-」に
      .replace(/\s+/g, 'T'); // 日付と時間の間のスペースを「T」に置換

    return normalized;
  },
  /**
   * 渡された文字列を厳格な IsoDateTimeString 型に変換する
   * @param value string 検証・変換 対象の文字列 例: "2026-05-11 12:34:56"
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11 12:34:56")
   * @throws 変換できない文字列や不正な日付の場合にエラーを投げます
   */
  fromRaw(value: string): IsoDateTimeString {
    const result = this.tryFromRaw(value);
    if (!result)
      throw new Error('有効な日時を入力してください "yyyy/mm/dd hh:mm:ss"');
    return result;
  },

  /**
   * 渡された文字列を厳格な IsoDateTimeString 型に変換
   * 変換できない場合は throw new error せずに null を返す
   * @param value 検証・変換 対象の文字列 例: "2026-05-11 12:34:56"
   * @returns IsoDateTimeString 型 (安全な日付文字列 例: "2026-05-11 12:34:56") または null
   *
   */
  tryFromRaw(value: string): IsoDateTimeString | null {
    if (IsoDateTimeString.isValid(value)) return value; // 妥当な場合はそのまま返す
    const normalized = this.normalize(value);
    try {
      const datetime = Temporal.Instant.from(
        normalized.includes('Z') || /[-+]\d{2}/.test(normalized)
          ? normalized
          : `${normalized}Z`,
      );
      return datetime.toString() as IsoDateTimeString; // 変換後の日時が妥当な場合は返す
    } catch {
      return null; // 変換できない場合 null を返す
    }
  },

  isValid(value: string): value is IsoDateTimeString {
    return this.STRICT_REGEX.test(value);
  },
};
