// src/constants/prefectures.ts

/*
 * 現在、zipocodeUtils.ts fetchAddressByZipCodeで
 * 直接 都道府県・市区町村・住所を文字列で取得し入力させているが、
 * 将来的に都道府県コードを使用する可能性、select optionsで選択できるようにする必要性を考慮して、
 * 都道府県コードと名称のマスタを定義します。
 * （都道府県コードは、英語表記のローマ字を使用し、UIなどで表示する際には日本語の名称を使用する形にします。）
 * これにより、将来的に都道府県コードを使用する場合や、UIで選択肢を表示する場合などに便利になります。
 */

// 都道府県コードと名称のマスタ
export const PREFECTURE_MASTER = {
  Hokkaido: '北海道',
  Aomori: '青森県',
  // ...（以下、全47都道府県を同様に定義）
  Okinawa: '沖縄県',
} as const;

// 都道府県コードの型
export type PrefectureCode = keyof typeof PREFECTURE_MASTER;

// バリデーション用のコード配列（ark.enumに渡す用）
export const PREFECTURE_CODES = Object.keys(
  PREFECTURE_MASTER,
) as readonly PrefectureCode[];

/*
 * UI Select用の選択肢（value-labelペアの配列）
 *  もしUI側で必要なら、以下のように生成できます。
 * 現時点ではpxSchema.ts内で直接ark.enumに渡す形にしているため、UI用の選択肢は定義していませんが、
 *  必要に応じて以下のコードを参考にしてください。
 *
 * export const PREFECTURE_OPTIONS: { value: PrefectureCode; label: string }[] =
 *   PREFECTURE_CODES.map((key) => ({
 *     value: key,
 *     label: PREFECTURE_MASTER[key],
 *   }));
 */
