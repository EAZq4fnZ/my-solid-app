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
  Iwate: '岩手県',
  Miyagi: '宮城県',
  Akita: '秋田県',
  Yamagata: '山形県',
  Fukushima: '福島県',
  Ibaraki: '茨城県',
  Tochigi: '栃木県',
  Gunma: '群馬県',
  Saitama: '埼玉県',
  Chiba: '千葉県',
  Tokyo: '東京都',
  Kanagawa: '神奈川県',
  Niigata: '新潟県',
  Toyama: '富山県',
  Ishikawa: '石川県',
  Fukui: '福井県',
  Yamanashi: '山梨県',
  Nagano: '長野県',
  Gifu: '岐阜県',
  Shizuoka: '静岡県',
  Aichi: '愛知県',
  Mie: '三重県',
  Shiga: '滋賀県',
  Kyoto: '京都府',
  Osaka: '大阪府',
  Hyogo: '兵庫県',
  Nara: '奈良県',
  Wakayama: '和歌山県',
  Tottori: '鳥取県',
  Shimane: '島根県',
  Okayama: '岡山県',
  Hiroshima: '広島県',
  Yamaguchi: '山口県',
  Tokushima: '徳島県',
  Kagawa: '香川県',
  Ehime: '愛媛県',
  Kochi: '高知県',
  Fukuoka: '福岡県',
  Saga: '佐賀県',
  Nagasaki: '長崎県',
  Kumamoto: '熊本県',
  Oita: '大分県',
  Miyazaki: '宮崎県',
  Kagoshima: '鹿児島県',
  Okinawa: '沖縄県',
} as const;

// 都道府県コードの型
export type PrefectureCode = keyof typeof PREFECTURE_MASTER;

// バリデーション用のコード配列（ark.enumに渡す用）
export const PREFECTURE_CODES = Object.keys(
  PREFECTURE_MASTER,
) as readonly PrefectureCode[];

// JISコード（1〜47）の順番にローマ字キーを並べた配列
export const JIS_PREFECTURE_CODES: PrefectureCode[] = [
  'Hokkaido',
  'Aomori',
  'Iwate',
  'Miyagi',
  'Akita',
  'Yamagata',
  'Fukushima',
  'Ibaraki',
  'Tochigi',
  'Gunma',
  'Saitama',
  'Chiba',
  'Tokyo',
  'Kanagawa',
  'Niigata',
  'Toyama',
  'Ishikawa',
  'Fukui',
  'Yamanashi',
  'Nagano',
  'Gifu',
  'Shizuoka',
  'Aichi',
  'Mie',
  'Shiga',
  'Kyoto',
  'Osaka',
  'Hyogo',
  'Nara',
  'Wakayama',
  'Tottori',
  'Shimane',
  'Okayama',
  'Hiroshima',
  'Yamaguchi',
  'Tokushima',
  'Kagawa',
  'Ehime',
  'Kochi',
  'Fukuoka',
  'Saga',
  'Nagasaki',
  'Kumamoto',
  'Oita',
  'Miyazaki',
  'Kagoshima',
  'Okinawa',
];

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
