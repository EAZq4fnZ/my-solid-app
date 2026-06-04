// src/components/ui/DatePicker/EraDatePicker.tsx
import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';

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
  // 入力フィールドが現在フォーカス（編集）されているかを管理するフラグ
  const [isFocused, setIsFocused] = createSignal(false);

  return (
    <div
      // コンポーネントのエリアにフォーカスが入ったか外れたかをシームレスにキャッチする
      onFocusIn={() => setIsFocused(true)}
      onFocusOut={() => setIsFocused(false)}
    >
      <DatePicker
        label={props.label}
        error={props.error}
        placeholder={props.placeholder ?? '日付を選択 (例: 令和...)'}
        value={props.value}
        
        // DB登録時: 親へは常に不純物なしの "2026-06-04"（IsoDateString）を渡す
        onValueChange={(isoValue) => {
          props.onDateChange(isoValue as IsoDateString | null);
        }}

        // 表示の切り替えロジック
        format={(d) => {
          if (!d) return '';
          // Ark UIの内部日付(DateValue)を一度ISO標準文字に直す
          const iso = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          
          if (isFocused()) {
            // フォーカス時: 2026/06/04
            return formatCustom(iso, 'YYYY/MM/DD');
          } else {
            // フォーカス外: 2026(令和08)/06/04
            return formatCustom(iso, 'YYYY(ENEYT)/MM/DD');
          }
        }}

        // ユーザーの手入力を安全にパースする既存の防衛ロジック（そのまま維持）
        parse={(text) => {
          const parsedStr = dateUtils.tryFromRaw(text);
          if (parsedStr && dateUtils.isValid(parsedStr)) {
            try {
              return parseDate(parsedStr);
            } catch {
              return undefined;
            }
          }
          return undefined;
        }}
        parts={{
          renderControl: renderEraControl,
          renderContent: (api, styles) =>
            renderCommonContent(api, styles, {
              renderRangeText: renderEraRangeText,
            }),
          renderRangeText: renderEraRangeText,
        }}
      />
    </div>
  );
};