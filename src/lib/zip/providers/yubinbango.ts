// src/lib/zip/providers/yubinbango.ts
import { PrefectureRegistry } from '@/constants/prefectures';
import type { RawZipDataFetcher } from '@/types/zip';

// 🌟 都道府県マスター知識をここにカプセル化 (外部の @/constants を汚さない)

const JIS_PREFECTURES = Object.values(PrefectureRegistry.master) as string[];

type YubinRawValue = [number, string, string, string?];

/**
 * yubinbango-data 用の生データフェッチャー
 */
export const resolveYubinbangoAddress: RawZipDataFetcher = async (zip) => {
  const threeDigits = zip.slice(0, 3);
  const res = await fetch(
    `https://yubinbango.github.io/yubinbango-data/data/zips/${threeDigits}.js`,
  );
  if (!res.ok) return null;

  const text = await res.text();
  const jsonStr = text.replace(/^\$yubinBango\((.*)\);?$/, '$1');
  const rawMap: Record<string, YubinRawValue> = JSON.parse(jsonStr);

  // コアが扱いやすいように、JISコード(数値)をこの時点で「都道府県名文字列」に翻訳して返却
  const cleanMap: Record<string, string[]> = {};
  for (const [zip, values] of Object.entries(rawMap)) {
    const prefIndex = values[0] - 1;
    const prefName = JIS_PREFECTURES[prefIndex] ?? '';
    cleanMap[zip] = [prefName, values[1], values[2], values[3] ?? '']; // 郵便番号、都道府県、市区町村、町域、通り
  }

  return cleanMap;
};
