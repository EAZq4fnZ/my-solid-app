// src/lib/ark.ts
import { type } from 'arktype';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { normalizeJapaneseInput } from '@/utils/string';
import { zipUtils } from './zip';

// ark.normalized,required,optional等に使うためクラス外部に定義を公開
const normalized = type('string').pipe((s: string) =>
  normalizeJapaneseInput(s),
);

export const ark = {
  // 全角英数・スペースおよび一部記号を半角に、半角カナを全角カナに変換する
  normalized: normalized,

  // 必須：正規化して1文字以上
  required: normalized.and('string>=1'),

  // 任意：空文字を許容 (正規化して0文字以上)
  optional: normalized.or('""'), // .or('null'),

  /*
   * 全角カタカナ：正規化して全角カタカナのみを許容
   * 1. 入力をNFKC正規化して全角スペースを半角スペースに変換
   * 2. ひらがなをカタカナに変換
   * 3. 全角カタカナと半角スペースのみを許容
   */
  tozenkana: type('string').pipe((s) => {
    //const normalized = s.normalize('NFKC').trim().replace(/\s+/g, ' ');
    const normalized = normalizeJapaneseInput(s.trim()).replace(/\s+/g, ' ');
    //  const result = hiraToKana(normalized);
    return hiraToKana(normalized);
  }, type('/^[ァ-ヶー・\\s]+$/')),

  /** 電話番号バリデーター (libphonenumber-js版) */
  tel: type('string').pipe((s, ctx) => {
    const normalized = normalizeJapaneseInput(s).replace(/\s+/g, '');
    const phoneNumber = parsePhoneNumberFromString(normalized, 'JP');
    if (phoneNumber?.isValid()) {
      return phoneNumber.formatNational();
    }
    return ctx.error('有効な電話番号を入力してください');
  }),

  // 郵便番号：@see zipCodeSchema

  // メール：pipeの中で正規化と小文字化を済ませてから email 型チェックへ渡す
email: type('string.email').pipe((s) => {
  return normalizeJapaneseInput(s).trim().toLowerCase();
}),

  // 日付：(必須)、arktype.string.dateは空文字不可のため、空文字許容の場合はpipe処理も入れる
  date: type('string.date'),

  /** 
   * 汎用的な列挙型バリデーターを作る関数
   *  実際の選択肢は別途 @/constants で定義する
   */
// enum: (values: readonly string[]) => type.enumerated(...values),
};

// --- ユーティリティ関数 ---
// ひらがなをカタカナに変換するユーティリティ関数
const hiraToKana = (str: string) => {
  return str.replace(/[ぁ-ん]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0x60),
  );
};
