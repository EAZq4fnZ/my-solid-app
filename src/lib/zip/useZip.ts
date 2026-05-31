// src/lib/zip/useZip.ts
import { createResource, createSignal } from 'solid-js';

import type { StAddrInfo, ZipResult } from '@/types/zip';
import { activeZipModule } from './registry'; // アクティブなレジストリから取得

export const useZip = () => {
  const [inputValue, setInputValue] = createSignal('');

  const sourceQuery = () => {
    const cleanZip = inputValue().replace(/-/g, '');
    return cleanZip.length >= 3 ? cleanZip : false;
  };

  const [suggestions] = createResource(
    sourceQuery,
    async (zip): Promise<ZipResult<StAddrInfo[]>> => {
      // 特定のプロバイダを直接呼ばず、共通のインターフェースで実行
      return await activeZipModule.fetchSuggestions(zip);
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
