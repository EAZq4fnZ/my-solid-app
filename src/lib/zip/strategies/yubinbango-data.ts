// src/lib/zip/strategies/yubinbango-data.ts
import {
  JIS_PREFECTURE_CODES,
  PREFECTURE_MASTER,
} from '@/constants/prefectures';
import {
  type StAddrInfo,
  ZipCode,
  type ZipProvider,
  type ZipResult,
} from '../types';

/**
 * yubinbango-dataの各エントリの型定義
 * YubinDataValue = [number, string, string, string?]
 * [0]: 都道府県JISコード(prefCode) numeber
 * [1]: 市区町村名(cityName) string
 * [2]: 町域名(townName) string
 * [3]: 番地・ビル名など（オプション street）string
 *
 * YubinDataMap = Record<string, YubinDataValue>
 * string: 郵便番号(7桁) string
 */
type YubinDataValue = [number, string, string, string?];
type YubinDataMap = Record<string, YubinDataValue>;

export const yubinbangoProvider: ZipProvider = {
  name: 'yubinbango-data',

  /**
   * 郵便番号（7桁）から住所を1件取得する
   * @param zip 郵便番号 (例: 1234567, 123-4567) string
   * @returns 住所情報 {success: true, data: StAddrInfo, errMessage: null} または {success: false, data: null, errMessage: string}
   */
  fetchByZip: async (zip: string): Promise<ZipResult<StAddrInfo>> => {
    const normalizedZip = zip.replace('-', ''); // 検索のためハイフンを削除
    const first3 = normalizedZip.slice(0, 3); // 先頭の3桁を抽出。yubinbango-dataのファイル名は[3桁.js]となっている

    try {
      const res = await fetch(
        `https://yubinbango.github.io/yubinbango-data/data/zips/${first3}.js`,
      );
      if (!res.ok)
        // APIアクセスに失敗
        return {
          success: false,
          data: null,
          errMessage: 'APIアクセスに失敗しました',
        };

      const text = await res.text();
      // $yubinBango({...}); というJS実行形式からJSON部分だけを抽出
      const jsonStr = text.replace(/^\$yubinBango\((.*)\);?$/, '$1');
      const data: YubinDataMap = JSON.parse(jsonStr);

      const details = data[normalizedZip]; // jsonから郵便番号(ハイフンなし)で検索
      if (!details)
        // 検索結無し
        return {
          success: false,
          data: null,
          errMessage: '該当する郵便番号の住所が見つかりませんでした。',
        };

      const romanKey = JIS_PREFECTURE_CODES[details[0] - 1];
      const prefName = PREFECTURE_MASTER[romanKey]; // 都道府県コードから都道府県名を取得

      return {
        success: true, // 検索成功
        errMessage: null,
        data: {
          fullAddress: `${prefName}${details[1]}${details[2]}${details[3] ?? ''}`,
          addrParts: {
            zipCode: ZipCode.fromRaw(
              ZipCode.normalize(normalizedZip), // 検索結果の郵便番号に正規化(ハイフン付加)してZipCode型に変換
            ),
            prefName,
            cityName: details[1],
            townName: details[2],
            blockName: '', // details[3] ?? '' yubinbango-dataには番地情報はない
          },
        },
      };
    } catch (e) {
      return {
        success: false, // 検索失敗(WEBサーバーエラー等 予期せぬエラー)
        data: null,
        errMessage:
          e instanceof Error ? e.message : '予期せぬエラーが発生しました',
      };
    }
  },

  /**
   * 入力中の文字列から候補リストを生成する
   */
  fetchSuggestions: async (input: string): Promise<ZipResult<StAddrInfo[]>> => {
    const normalizedInput = input.replace('-', ''); // 検索のため一旦ハイフンを削除
    if (normalizedInput.length < 3)
      return { success: true, data: [], errMessage: null }; // 3桁未満は検索・通信対象外

    const first3 = normalizedInput.slice(0, 3); // 先頭の3桁を抽出

    try {
      // 郵便番号3桁に対応するJSファイルを取得
      const res = await fetch(
        `https://yubinbango.github.io/yubinbango-data/data/zips/${first3}.js`,
      );
      if (!res.ok) return { success: true, data: [], errMessage: null }; // APIアクセスに失敗

      const text = await res.text();
      // $yubinBango({...}); というJS実行形式からJSON部分だけを抽出
      const jsonStr = text.replace(/^\$yubinBango\((.*)\);?$/, '$1');
      const data: YubinDataMap = JSON.parse(jsonStr);

      // dataのキー（7桁フル番号）をループして絞り込む
      const suggestions = Object.entries(data)
        .filter(([fullZip]) => fullZip.startsWith(normalizedInput)) // 入力された数字で始まるものを抽出
        .map(([fullZip, d]) => {
          const romanKey = JIS_PREFECTURE_CODES[d[0] - 1];
          // jsonから都道府県コード→都道府県名を変換
          const prefName = PREFECTURE_MASTER[romanKey];
          return {
            fullAddress: `${prefName}${d[1]}${d[2]}${d[3] ?? ''}`,
            addrParts: {
              zipCode: ZipCode.fromRaw(ZipCode.normalize(fullZip)),
              prefName,
              cityName: d[1],
              townName: d[2],
              blockName: '', // d[3] ?? '', yubinbango-dataには番地情報はない
            },
          };
        });
      // 検索成功。サジェストとしてsuggestions(配列オブジェクト)を返す
      return { success: true, data: suggestions, errMessage: null };
    } catch {
      // サジェストの失敗はユーザー体験を損なわないよう空配列で返す
      return { success: true, data: [], errMessage: null };
    }
  },
};
