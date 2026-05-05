// src/components/ui/EraDatePicker/inner-utils.ts
import { getDaysInMonth } from 'date-fns';

import { getJpEraYear } from '@/utils/dateUtils';

export interface DateOption {
  label: string;
  value: string;
}

/*
 * 年選択肢を生成
 * @param start 開始年 (省略可)
 * @param end 終了年 (省略可、デフォルトは今年)
 * @param count 年数 (省略可、デフォルトは100年間)
 * @return 年選択肢(Selectのoptionsに使用)
 */
export const generateYearOptions = ({
  start,
  end = new Date().getFullYear(),
  count = 100,
}: {
  start?: number;
  end?: number;
  count?: number;
} = {}): DateOption[] => {
  const effectiveStart = start && start <= end ? start : undefined;
  const len = effectiveStart ? end - effectiveStart + 1 : count;
  return Array.from({ length: len }, (_, i) => {
    const y = end - i;
    const era = getJpEraYear(y);
    return { label: `${y} (${era})年`, value: String(y) };
  });
};

export const generateMonthOptions = (): DateOption[] =>
  Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: String(i + 1),
  }));

/*
 * 年月を指定して日付選択肢を生成
 * (eraDatePicker.tsx ではArkDatePickerのAPIを使用するため、この関数は未使用)
 * @param yearStr 年
 * @param monthStr 月
 * @return 日付選択肢
 */
export const generateDayOptions = (
  yearStr: string,
  monthStr: string,
): DateOption[] => {
  const y = Number.parseInt(yearStr, 10) || new Date().getFullYear();
  const m = Number.parseInt(monthStr, 10) || 1;
  const days = getDaysInMonth(new Date(y, m - 1));
  return Array.from({ length: days }, (_, i) => ({
    label: `${i + 1}日`,
    value: String(i + 1),
  }));
};

export const parseDateString = (dateStr: string) => {
  //if (!dateStr || !dateStr.includes('-'))
  if (!dateStr?.includes('-')) return { year: '', month: '', day: '' }; // 日付として成立しない場合

  const parts = dateStr.split('-');

  // 1 -> "1", 01 -> "1" に正規化してSelectのvalueと一致させる
  const normalize = (val: string | undefined) => {
    if (!val) return '';
    return String(Number.parseInt(val, 10));
  };

  return {
    year: parts[0] || '',
    month: normalize(parts[1]),
    day: normalize(parts[2]),
  };
};

export const serializeDate = (
  year: string,
  month: string,
  day: string,
): string => {
  if (!year) return ''; // 年がない場合は日付として成立しないため空

  const formatNum = (val: string) => {
    if (!val) return '';
    return val.padStart(2, '0');
  };

  return `${year}-${formatNum(month)}-${formatNum(day)}`;
};
