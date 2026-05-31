// src/lib/zip/core.ts
import { type } from 'arktype';

import type {
  StAddrInfo,
  ZipCode,
  ZipModule,
  ZipModuleConfig,
  ZipResult,
} from '@/types/zip';
import { normalizeJapaneseInput } from '@/utils/string';

/** ゆるい判定：全角・半角・ハイフンの有無に関わらず、数字7桁を抽出する */
const LOOSE_REGEX = /^([0-9０-９]{3})[-−ー－\s]?([0-9０-９]{4})$/;
/** 厳格な判定：すでにシステム標準の「123-4567」の形になっているか */
const STRICT_REGEX = /^\d{3}-\d{4}$/;

/**
 * 郵便番号の文字列操作ユーティリティ（旧 types/zip.ts のロジック）
 */
export const zipUtils = {
  isValid(value: string): value is ZipCode {
    return STRICT_REGEX.test(value);
  },

  normalize(value: string): string {
    const cleaned = normalizeJapaneseInput(value.trim())
      .replace(/[－−ー]/g, '-')
      .trim();
    const match = cleaned.match(LOOSE_REGEX);
    if (!match) return value;

    const [, p1, p2] = match;
    return `${p1}-${p2}`;
  },

  tryFromRaw(value: string): ZipCode | null {
    if (this.isValid(value)) return value;
    const normalized = this.normalize(value);
    if (this.isValid(normalized)) return normalized;
    return null;
  },

  fromRaw(value: string): ZipCode {
    const result = this.tryFromRaw(value);
    if (!result) {
      throw new Error('郵便番号は "123-4567" 形式で入力してください');
    }
    return result;
  },
};

/**
 * ArkType用の郵便番号スキーマ（pxSchema等で大活躍するもの）
 * 配列パイプラインの統一構文に変更しています
 */
export const zipCodeSchema = type([
  'string',
  '=>',
  (s) => zipUtils.tryFromRaw(s) ?? '正しい郵便番号(123-4567)',
]);

export function createZipModule(config: ZipModuleConfig): ZipModule {
  const fetchByZip = async (zip: string): Promise<ZipResult<StAddrInfo>> => {
    const normalizedZip = zip.replace(/-/g, '');
    if (normalizedZip.length !== 7) {
      return {
        success: false,
        data: null,
        errMessage: '郵便番号は7桁で入力してください(1234567,123-4567)',
      };
    }

    try {
      // DIされたプロバイダ関数から、整形済みの「住所配列」を取得する
      const dataMap = await config.resolveAddress(normalizedZip);
      if (!dataMap) {
        return {
          success: false,
          data: null,
          errMessage: '住所情報の取得に失敗しました',
        };
      }

      const details = dataMap[normalizedZip];
      if (!details || details.length < 3) {
        return {
          success: false,
          data: null,
          errMessage: '該当する郵便番号の住所が見つかりませんでした。',
        };
      }
      // 郵便番号から取得した住所情報 (都道府県名、市区町村名、町域名、通り) を配列に格納
      const [prefName, cityName, townName, street] = details;

      return {
        success: true,
        errMessage: null,
        data: {
          fullAddress: `${prefName}${cityName}${townName}${street ?? ''}`,
          addrParts: {
            zipCode: zipUtils.fromRaw(zipUtils.normalize(normalizedZip)),
            prefName,
            cityName,
            townName,
            street: street ?? '',
          },
        },
      };
    } catch (e) {
      return {
        success: false,
        data: null,
        errMessage:
          e instanceof Error ? e.message : '予期せぬエラーが発生しました',
      };
    }
  };

  const fetchSuggestions = async (
    input: string,
  ): Promise<ZipResult<StAddrInfo[]>> => {
    const normalizedInput = input.replace(/-/g, '');
    if (normalizedInput.length < 3) {
      return { success: true, data: [], errMessage: null }; // 3桁未満の場合は空配列を返す(画面上は表示しない／何もしない)
    }
    try {
      const dataMap = await config.resolveAddress(normalizedInput);
      if (!dataMap) return { success: true, data: [], errMessage: null }; // 住所情報の取得に失敗した場合は空配列を返す

      const suggestions = Object.entries(dataMap)
        .filter(([fullZip]) => fullZip.startsWith(normalizedInput))
        .map(([fullZip, d]) => {
          const [prefName, cityName, townName, street] = d;
          return {
            fullAddress: `${prefName}${cityName}${townName}${street ?? ''}`,
            addrParts: {
              zipCode: zipUtils.fromRaw(zipUtils.normalize(fullZip)),
              prefName,
              cityName,
              townName,
              blockName: street ?? '',
            },
          };
        });

      return { success: true, data: suggestions, errMessage: null };
    } catch {
      return { success: true, data: [], errMessage: null };
    }
  };

  return {
    providerName: config.providerName,
    fetchByZip,
    fetchSuggestions,
  };
}

/**
 * ZipCode 型に変換するためのスキーマ
 * - 文字列を受け取って、正規化された ZipCode型の文字列 を返す
 */
/*export const ZipCodeSchima = type('string').pipe(
  (s: string) => zipUtils.normalize(s), // 既存のZipCode.normalize をパイプに流用
  type('/^\\d{3}-\\d{4}$/'),
  (s: string) => s as ZipCode, // ZipCode 型であることを明示的に示す
);*/
