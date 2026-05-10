// src/utils/stringUtils.ts
/**
 * Unicode正規化(NFKC)を行い、前後の空白を除去
 * 全角英数を半角にし、ユーザーの入力揺れを最小限に抑えるために使用
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 */
export const normalizeString = (value: string | null | undefined): string => {
  if (!value) return ''; // null or undefined なら空文字列を返す
  // NFKC: 全角「１」→ 半角「1」、全角「Ａ」→ 半角「A」
  // trim: 前後のスペース（全角スペース含む）を除去
  return value.normalize('NFKC').trim();
};

/**
 * 数字以外の文字（ハイフン、スペース、文字など）をすべて除去する
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */
export const extractNumbers = (value: string | null | undefined): string => {
  if (!value) return ''; // null or undefined なら空文字列を返す
  return value.replace(/\D/g, ''); // 数字以外の文字を全て除去
};

/**
 * 文字列を正規化した上で、数値に変換する
 * 変換できない場合は fallback（デフォルトは 0）を返す
 */
export const normalizeNumber = (
  value: string | null | undefined,
  fallback: number = 0,
): number => {
  const normalized = normalizeString(value); // 文字列を正規化
  const num = Number.parseInt(normalized, 10); // 文字列を数値に変換
  return isNaN(num) ? fallback : num; // 変換できない場合は fallback を返す
};
