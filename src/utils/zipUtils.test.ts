// src/utils/zipUtils.test.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchAddressDetailByZip,
  formatZipCode,
  formatZipCodeWithHyphen,
} from './zipUtils';

describe('zipUtils', () => {
  // 元の fetch を退避させておく
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    // テストごとに fetch を元に戻し、モックをリセットする
    (globalThis as any).fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('formatZipCode', () => {
    it('郵便番号からハイフンや全角を除去して半角数字のみを返すこと', () => {
      expect(formatZipCode('123-4567')).toBe('1234567');
      expect(formatZipCode('１２３－４５６７')).toBe('1234567');
    });
  });

  describe('formatZipCodeWithHyphen', () => {
    it('入力された数字が3桁以下の場合、その数字を返す', () => {
      expect(formatZipCodeWithHyphen('123')).toBe('123');
      expect(formatZipCodeWithHyphen('12')).toBe('12');
      expect(formatZipCodeWithHyphen('1')).toBe('1');
      expect(formatZipCodeWithHyphen('')).toBe('');
    });

    it('入力された文字列の3桁目の後にハイフンを挿入して返す', () => {
      expect(formatZipCodeWithHyphen('１２３４５６７')).toBe('123-4567');
      expect(formatZipCodeWithHyphen('98765432')).toBe('987-6543');
      expect(formatZipCodeWithHyphen('567890123')).toBe('567-8901');
    });
  });

  describe('fetchAddressDetailByZip', () => {
    it('有効な郵便番号の時に住所情報が正しく返されること', async () => {
      const mockResponse = {
        status: 200,
        results: [
          {
            address1: '東京都',
            address2: '新宿区',
            address3: '西新宿2-8-1',
            prefcode: '13',
          },
        ],
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      // Windows/Bun環境でも確実に動作するように globalThis を直接操作
      (globalThis as any).fetch = fetchMock;

      const result = await fetchAddressDetailByZip('123-4567');

      expect(result.status).toBe(200);
      expect(result.result?.address1).toBe('東京都');
    });

    it('検索結果が空の時にメッセージを返すこと', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 200, results: null }),
      });

      (globalThis as any).fetch = fetchMock;

      const result = await fetchAddressDetailByZip('123-4567');
      expect(result.message).toBe('該当する住所が見つかりませんでした');
    });
  });
});
