// zipCode.ts

// zipcloud.ibsnet.co.jp のAPIを呼び出して、取得した住所情報
export interface AddressResult {
  prefecture: string; // 例: 東京都
  city: string; // 例: 新宿区
  address: string; // 例: 西新宿2-8-1
  fullAddress: string; // 例: 東京都新宿区西新宿2-8-1
  prefectureKana: string;
  cityKana: string;
  addressKana: string;
  fullAddressKana: string;
  prefCode: string; // 例: 13
  zipCode: string;
  status: number; // APIのステータスコード（例: 200）
  message: string | null; // APIからのメッセージ（例: "検索成功"）
}

// APIからのレスポンスがない場合やエラーが発生した場合に返すデフォルト値（空）の構造体
export const AddressResultDefault: AddressResult = {
  prefecture: '',
  city: '',
  address: '',
  fullAddress: '',
  prefectureKana: '',
  cityKana: '',
  addressKana: '',
  fullAddressKana: '',
  prefCode: '',
  zipCode: '',
  status: 0,
  message: null,
};

/**
 * 郵便番号から数字だけを抽出する (全角・記号の除去)
 */
export const formatZipCode = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, '')
    .slice(0, 7);
};
/**
 * ハイフンを含めた形式に変換 (例: 1234567 → 123-4567)
 */
export const formatZipCodeWithHyphen = (digits: string): string => {
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
};

// 郵便番号から住所を取得する関数
export const fetchAddressDetailByZip = async (
  zip: string,
): Promise<AddressResult> => {
  const cleanZip = formatZipCode(zip); // 検索用にハイフン除去などの正規化
  // 郵便番号は7桁でなければならないため、無効な場合は空の構造体を返す
  // ［検索結果ステータス：400、message: '無効な郵便番号です'］
  if (cleanZip.length !== 7) {
    return {
      ...AddressResultDefault, // 空の構造体をコピー
      zipCode: cleanZip,
      status: 400,
      message: '無効な郵便番号です',
    };
  }

  try {
    // 検索API呼び出し
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`,
    );
    const data = await res.json();

    // エラーまたは結果がない場合も AddressResultDefault(中身は空) 形式で戻す
    // ［検索結果ステータス：404、message: '住所が見つかりませんでした'］
    if (data.status !== 200 || !data.results) {
      // APIエラーや見つからない場合
      return {
        ...AddressResultDefault, // 空の構造体をコピー
        zipCode: formatZipCodeWithHyphen(cleanZip),
        status: data.status === 200 && !data.results ? data.status : 404,
        message: data.message || '住所が見つかりませんでした',
      };
    }

    const result = data.results[0];

    // 成功時(status === 200)の return文
    return {
      //  APIからの住所情報を AddressResult 形式で返す
      prefecture: result.address1,
      city: result.address2,
      address: result.address3,
      fullAddress: `${result.address1}${result.address2}${result.address3}`,
      // カタカナの住所も返す（必要に応じて）
      prefectureKana: result.kana1,
      cityKana: result.kana2,
      addressKana: result.kana3,
      fullAddressKana: `${result.kana1}${result.kana2}${result.kana3}`,
      // その他のAPIレスポンス情報も返す
      prefCode: result.prefcode,
      zipCode: formatZipCodeWithHyphen(cleanZip),
      status: data.status,
      message: data.message,
    };
  } catch (err) {
    // エラーキャッチ：ネットワークエラー等の例外を想定
    // ［検索結果ステータス：500、message: 'ネットワークエラーが発生しました'］
    return {
      ...AddressResultDefault, // 空の構造体をコピー
      zipCode: formatZipCodeWithHyphen(cleanZip),
      status: 500,
      message: 'ネットワークエラーが発生しました',
    };
  }
};
