// src/lib/zip/useZip.ts (または index.ts に追記)
import { createResource, createSignal } from 'solid-js';

import { getZipSuggestions } from './index'; // 既存の検索関数
import type { StAddrInfo, ZipResult } from './types';

export const useZip = () => {
  const [inputValue, setInputValue] = createSignal('');

  // 郵便番号入力（inputValue）が変わるたびに自動で getZipSuggestions を実行
  /*const [suggestions] = createResource(inputValue, async (zip) => {
    const cleanZip = zip.replace(/-/g, '');
    if (cleanZip.length < 3) return []; // 3文字未満は API を叩かない
    return await getZipSuggestions(cleanZip);
  });*/
  const [suggestions] = createResource(
    inputValue,
    async (zip): Promise<ZipResult<StAddrInfo[]> | StAddrInfo[]> => {
      const cleanZip = zip.replace(/-/g, '');
      if (cleanZip.length < 3) return [];
      return await getZipSuggestions(cleanZip);
    },
  );

  return {
    inputValue,
    setInputValue,
    suggestions,
    isPending: suggestions.loading,
  };
};
