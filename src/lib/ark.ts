// src/lib/ark.ts
import { type } from 'arktype';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const ark = {
  // 必須：正規化して1文字以上
  required: type('string.normalize.NFKC').and('string>=1'),

  // 任意：空文字を許容 (正規化して0文字以上)
  optional: type("'' | string").pipe((s) => {
    if (s === '' || s == null) return '';
    return s.normalize('NFKC').trim();
  }),

  /*
   * 全角カタカナ：正規化して全角カタカナのみを許容
   * 1. 入力をNFKC正規化して全角スペースを半角スペースに変換
   * 2. ひらがなをカタカナに変換
   * 3. 全角カタカナと半角スペースのみを許容
   */
  tozenkana: type('string').pipe((s) => {
    const normalized = s.normalize('NFKC').trim().replace(/\s+/g, ' ');
    //  const result = hiraToKana(normalized);
    return hiraToKana(normalized);
  }, type('/^[ァ-ヶー・\\s]+$/')),

  /*
   * 電話番号バリデーター (libphonenumber-js版)
   * 1. 空文字ならそのまま通す
   * 2. 全角を半角に正規化
   * 3. 日本(JP)の番号として妥当かチェック
   * 4. 妥当ならハイフン付きの国内形式 (090-1234-5678) に整形して出力
   */
  tel: type("'' | string").pipe((s, ctx) => {
    if (s === '' || s == null) return '';
    const normalized = s.normalize('NFKC').replace(/\s+/g, '');
    const phoneNumber = parsePhoneNumberFromString(normalized, 'JP');
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatNational();
    }
    return ctx.error('有効な電話番号を入力してください'); // throw ではなく ctx.error を使用
  }),

  // 郵便番号：pipeの中で正規化（123-4567）を済ませてから形式チェックへ渡す
  zip: type("'' | string").pipe(
    (s) => (s === '' || s == null ? '' : s.normalize('NFKC')),
    type('/^\\d{3}-\\d{4}$/ | ""'),
  ),

  // メール：pipeの中で正規化と小文字化を済ませてから email 型チェックへ渡す
  email: type("'' | string").pipe(
    (s) =>
      s === '' || s == null
        ? ''
        : s.normalize('NFKC').toLowerCase().replace(/＠/g, '@'),
    type('string.email | ""'),
  ),

  // 日付：(必須)、arktype.string.dateは空文字不可のため、空文字許容の場合はpipe処理も入れる
  date: type('string.date'),

  /*
   * 汎用的な列挙型バリデーターを作る関数
   *  性別、血液型、職業など、選択肢が限られる項目で使用
   *  実際の選択肢は別途 @/constants で定義する
   *
   *  例えば、性別コードのバリデーションを行う場合は、以下のように使用
   *   const GENDER_CODES = ['male', 'female', 'other'] as const;
   *   const genderSchema = ark.enum(GENDER_CODES);
   *  これにより、genderSchemaは 'male' | 'female   | 'other' のいずれかを許容するバリデーションになります。
   */
  enum: (values: readonly string[]) => type.enumerated(...values),
};

// ひらがなをカタカナに変換するユーティリティ関数
const hiraToKana = (str: string) => {
  return str.replace(/[ぁ-ん]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0x60),
  );
};
