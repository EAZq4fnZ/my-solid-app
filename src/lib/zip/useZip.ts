// src/lib/zip/useZip.ts (または index.ts に追記)
import { createResource, createSignal } from 'solid-js';
import { yubinbangoProvider } from './strategies/yubinbango-data';
import type { StAddrInfo, ZipResult } from './type';

export const useZip = () => {
  const [inputValue, setInputValue] = createSignal('');

  // 郵便番号入力（inputValue）が変わるたびに自動で getZipSuggestions を実行

  const sourceQuery = () => {
    const cleanZip = inputValue().replace(/-/g, '');
    return cleanZip.length >= 3 ? cleanZip : false; // false を返すと createResource は動かない
  };
  const [suggestions] = createResource(
    sourceQuery,
    async (zip): Promise<ZipResult<StAddrInfo[]>> => {
      return await yubinbangoProvider.fetchSuggestions(zip);
    },
  );

  return {
    inputValue,
    setInputValue,
    suggestions,
    suggestionList: (): StAddrInfo[] => suggestions()?.data ?? [],
    isPending: suggestions.loading,
    error: () => suggestions()?.errMessage,
  };
};
