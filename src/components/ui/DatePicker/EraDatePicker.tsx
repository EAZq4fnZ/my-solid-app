// src/components/ui/DatePicker/EraDatePicker.tsx
import { parseDate } from '@internationalized/date';
import type { IsoDateString } from '@/types/date';
import { dateUtils } from '@/lib/date';

import { DatePicker } from './DatePicker';
import { renderCommonContent } from './patterns/commonContent';
import { renderEraControl, renderEraRangeText } from './patterns/eraParts';

interface EraDatePickerProps {
  value: IsoDateString | null;
  onDateChange: (value: IsoDateString | null) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  editable?: boolean;
}

export const EraDatePicker = (props: EraDatePickerProps) => {
  return (
    <DatePicker
      label={props.label}
      error={props.error}
      placeholder={props.placeholder ?? '日付を選択 (例: 令和...)'}
      value={props.value}
      editable={props.editable}
      locale="ja-JP"
      onValueChange={(isoValue) => {
        props.onDateChange(isoValue as IsoDateString | null);
      }}
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
  );
};
