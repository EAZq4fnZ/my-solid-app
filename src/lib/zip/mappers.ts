// src/lib/zip/mappers.ts
import type { StAddrInfo } from '@/types/zip';

/** 郵便番号を選択した際のフォーム反映ロジック */
export const zipToAddressMapper = (
  item: StAddrInfo,
  // biome-ignore lint/suspicious/noExplicitAny: <form: any>
  form: any, // 汎用性を高めるためanyとする
  name: string,
  targetName: string,
) => {
  form.setFieldValue(name, item.addrParts.zipCode);
  form.setFieldValue(targetName, item.fullAddress);
};
