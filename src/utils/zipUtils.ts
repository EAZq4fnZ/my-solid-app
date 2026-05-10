// src/utils/zipUtils.ts
import { extractNumbers, normalizeString } from './stringUtils';

export interface ZipCloudResponse {
  status: number; // ステータス	正常時 200、エラー発生時(400,500)
  message: string | null; // メッセージ 正常時は空、エラーの内容が返される。
  results: AddressResultDetail[] | null; // 検索結果(AddressResultDetail型の配列)
}
export interface AddressResult {
  status: number;
  message: string | null;
  result: AddressResultDetail | null; // 配列ではなく単一オブジェクトとして定義、ZipCloudResponse.results[0] と同等
}

//	--- 検索結果が複数存在する場合は、以下の項目が配列として返される ---
export interface AddressResultDetail {
  zipcode: string; //	郵便番号 7桁の郵便番号(ハイフンなし)
  prefcode: string; // 都道府県コード JIS X 0401 に定められた2桁の都道府県コード。
  address1: string; // 都道府県名
  address2: string; // 市区町村名
  address3: string; // 町域名
  kana1: string; //	都道府県名(カナ)
  kana2: string; //	市区町村名(カナ)
  kana3: string; //	町域名(カナ)
}
/**
 * 郵便番号を正規化、7桁に変換する
 * @param input 郵便番号 string
 * @returns 郵便番号 (例: 1234567) string
 */
export const formatZipCode = (input: string | null | undefined): string => {
  if (!input) return '';
  const cleaned = extractNumbers(normalizeString(input));
  return cleaned.slice(0, 7);
};

/**
 * ハイフンを含めた形式に変換 (例: 1234567 → 123-4567)
 * @param input 郵便番号 (例: 1234567) string
 * @returns 郵便番号 (例: 123-4567) string
 */
export const formatZipCodeWithHyphen = (
  input: string | null | undefined,
): string => {
  //if (!input) return '';  // 未入力の場合は空文字を返すが、formatZipCode によって空文字に変換されるので不要

  const zip = formatZipCode(input);

  return zip.length === 7 ? `${zip.slice(0, 3)}-${zip.slice(3)}` : zip; // 7桁の場合はハイフンを追加、そうでない場合はそのまま返す
};

/**
 * 郵便番号から住所を取得する
 * @param zip 郵便番号 string (例: 123-4567)
 * @returns 郵便番号から住所を取得する AddressResult(zipcloud.ibsnet.co.jp からのレスポンス)
 * @see https://zipcloud.ibsnet.co.jp/
 */
export const fetchAddressDetailByZip = async (
  zip: string,
): Promise<AddressResult> => {
  // 郵便番号のハイフンを除去 (123-4567 -> 1234567)
  // ハイフン付きでも一応 検索はできるが、ハイフンを除去しておく
  const cleanZip = formatZipCode(zip);

  // 7桁以外の場合(または空) 無効な郵便番号としてエラー内容を返す
  if (cleanZip.length !== 7) {
    return {
      status: 400, // 無効な郵便番号
      message: '無効な郵便番号です',
      result: null, // 空の構造体
    };
  }

  try {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`, // ZipCloudから郵便番号で住所を取得
    );
    const data = (await res.json()) as ZipCloudResponse;

    // APIエラーや見つからない場合
    if (data.status !== 200 || !data.results) {
      return {
        status: data.status,
        message:
          data.status === 200 // 見つからなくともapiが正常に動作していれば statusは200になる
            ? '該当する住所が見つかりませんでした'
            : data.message || 'APIエラーが発生しました', // それ以外は messageをそのまま返す
        result: null, // 空の構造体
      };
    }
    // 検索結果ステータス：200
    return {
      status: 200,
      message: null,
      result: data.results[0], // results配列の最初の要素を住所情報として返す
    };
  } catch (_) {
    // エラーキャッチ：ネットワークエラー等の例外を想定
    // ［検索結果ステータス：500、message: 'ネットワークエラーが発生しました'］
    return {
      status: 500,
      message: 'ネットワークエラーが発生しました',
      result: null,
    };
  }
};
