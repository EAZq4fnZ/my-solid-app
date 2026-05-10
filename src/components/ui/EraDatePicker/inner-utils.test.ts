import { describe, expect, it } from 'vitest';
import { generateYearOptions, generateMonthOptions } from './inner-utils';

describe('inner-utils', () => {
  describe('generateYearOptions', () => {
    it('年オプションの配列を返す。空の引数=>今年から100年間', () => {
      const options = generateYearOptions();
      expect(options.length).toBe(100); // 100年分の配列が返る
      console.table(options);
      options.forEach((option) => {
        expect(option.label).toMatch(
          /[0-9]{4} \([\u4E00-\u9FFF]{2}([0-9]{1,2}|元)\)年/,
        );
        expect(option.value).toMatch(/[0-9]{4}/);
      });
    });

    it('カスタムの開始年と終了年を含む年オプションの配列を返す=>2000年～2020年', () => {
      const options = generateYearOptions({ start: 2000, end: 2020 });
      expect(options.length).toBe(21); // 21年分(2000~2020)の配列が返る
      console.table(options);
      options.forEach((option) => {
        expect(option.label).toMatch(
          /[0-9]{4} \([\u4E00-\u9FFF]{2}([0-9]{1,2}|元)\)年/,
        );
        expect(option.value).toMatch(/[0-9]{4}/);
        expect(Number(option.value)).toBeGreaterThanOrEqual(2000);
        expect(Number(option.value)).toBeLessThanOrEqual(2020);
      });
    });

    it('カスタムカウントを含む年オプションの配列を返す=>今年から10年間', () => {
      const options = generateYearOptions({ count: 10 });
      expect(options.length).toBe(10); // 10年分の配列が返る
      console.table(options);
      options.forEach((option) => {
        expect(option.label).toMatch(
          /[0-9]{4} \([\u4E00-\u9FFF]{2}([0-9]{1,2}|元)\)年/,
        );
        expect(option.value).toMatch(/[0-9]{4}/);
      });
    });
  });

  describe('generateMonthOptions', () => {
    it('月の選択肢の配列を返す', () => {
      const options = generateMonthOptions();
      expect(options.length).toBe(12);
      console.table(options);
      options.forEach((option) => {
        expect(option.label).toMatch(/[0-9]{1,2}月/);
        expect(option.value).toMatch(/[0-9]{1,2}/);
      });
    });
  });
});
