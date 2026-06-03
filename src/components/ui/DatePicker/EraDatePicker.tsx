// src/components/ui/DatePicker/EraDatePicker.tsx
import { parseDate } from '@internationalized/date';

import type { IsoDateString } from '@/types/date';
import { dateUtils, formatCustom } from '@/lib/date';

import { DatePicker } from './DatePicker';
import { renderCommonContent } from './patterns/commonContent';
import { renderEraControl, renderEraRangeText } from './patterns/eraParts';

interface EraDatePickerProps {
  value: IsoDateString | null;
  onDateChange: (value: IsoDateString | null) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

export const EraDatePicker = (props: EraDatePickerProps) => {
  return (
    <DatePicker
      label={props.label}
      error={props.error}
      placeholder={props.placeholder ?? '日付を選択 (例: 令和...)'}
      value={props.value}
      // 🌟 修正ポイント1: 汎用的な string | null から、厳格な IsoDateString | null へ安全に型を格上げして通知する
      onValueChange={(isoValue) => {
        props.onDateChange(isoValue as IsoDateString | null);
      }}
      // [Displayへの変換]: カレンダーが保持している西暦データを、インプット上では「2026(令和08)/06/03」の和暦に化けさせる
      format={(d) => {
        if (!d) return '';
        const iso = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
        return formatCustom(iso, 'YYYY(ENEYT)/MM/DD');
      }}
      // 🌟 修正ポイント2: 手入力されたテキストを parseDate を使って Ark UI が理解できる DateValue オブジェクトに変換して戻す
      parse={(text) => {
        const parsedStr = dateUtils.tryFromRaw(text); // 例: "2026-06-03" の文字列が返る
        if (parsedStr && dateUtils.isValid(parsedStr)) {
          try {
            return parseDate(parsedStr); // 👈 ここで正規の DateValue オブジェクトに変換！
          } catch (_) {
            return undefined;
          }
        }
        return undefined;
      }}
      // 既存の高度なDIパーツを注入
      parts={{
        renderControl: renderEraControl,
        renderContent: (api, styles) =>
          renderCommonContent(api, styles, {
            renderRangeText: renderEraRangeText,
          }),
        renderRangeText: renderEraRangeText,
      }}
    />
  );
};
