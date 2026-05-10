// src/lib/zip/strategies/yubinbango-data.ts
import {
  JIS_PREFECTURE_CODES,
  PREFECTURE_MASTER,
} from '@/constants/prefectures';

import type { StAddrInfo, ZipProvider, ZipResult } from '../types';

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
  fetchByZip: async (zip: string): Promise<ZipResult<StAddrInfo | null>> => {
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

      // 生データのキーは "5590001" のような7桁フル
      const details = data[normalizedZip];
      if (!details) return { success: true, data: null, errMessage: null }; // 検索結無し

      const romanKey = JIS_PREFECTURE_CODES[details[0] - 1];
      const prefName = PREFECTURE_MASTER[romanKey];

      return {
        success: true, // 検索成功
        errMessage: null,
        data: {
          fullAddress: `${prefName}${details[1]}${details[2]}${details[3] ?? ''}`,
          addrParts: {
            // 保存・表示用に 123-4567 形式に整形
            zipCode: `${normalizedZip.slice(0, 3)}-${normalizedZip.slice(3)}`,
            prefName,
            cityName: details[1],
            townName: details[2],
            blockName: details[3] ?? '',
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
    const normalizedInput = input.replace('-', '');
    if (normalizedInput.length < 3)
      return { success: true, data: [], errMessage: null }; // 3桁未満は検索・通信対象外

    const first3 = normalizedInput.slice(0, 3); // 先頭の3桁を抽出

    try {
      const res = await fetch(
        `https://yubinbango.github.io/yubinbango-data/data/zips/${first3}.js`,
      );
      if (!res.ok) return { success: true, data: [], errMessage: null }; // APIアクセスに失敗

      const text = await res.text();
      const jsonStr = text.replace(/^\$yubinBango\((.*)\);?$/, '$1');
      const data: YubinDataMap = JSON.parse(jsonStr);

      // dataのキー（7桁フル番号）をループして絞り込む
      const suggestions = Object.entries(data)
        .filter(([fullZip]) => fullZip.startsWith(normalizedInput)) // 入力された数字で始まるものを抽出
        .map(([fullZip, d]) => {
          const romanKey = JIS_PREFECTURE_CODES[d[0] - 1];
          const prefName = PREFECTURE_MASTER[romanKey];

          return {
            fullAddress: `${prefName}${d[1]}${d[2]}${d[3] ?? ''}`,
            addrParts: {
              // キー（"5590001"）を "559-0001" に加工
              zipCode: `${fullZip.slice(0, 3)}-${fullZip.slice(3)}`,
              prefName,
              cityName: d[1],
              townName: d[2],
              blockName: d[3] ?? '',
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
