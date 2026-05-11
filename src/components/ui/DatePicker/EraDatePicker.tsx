// src/components/ui/DatePicker/EraDatePicker.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';

import { DatePickerRoot, type DatePickerRootProps } from './DatePicker';
import { renderCommonContent } from './patterns/commonContent';
import type { DatePickerApiObject, DatePickerViewStyles } from './types';
import { getJpEraInfo } from '@/utils/dateUtils';

/**
 * 西暦から和暦への変換ユーティリティ
 * ※実際には既存のGitHubリポジトリのクラスや共通ユーティリティを使用してください
 */
const format2JpEra = (isoDate: string | undefined): string => {
  if (!isoDate) return '';
  const d = new Date(isoDate);

  if (Number.isNaN(d.getTime())) return ''; // 不正な日付

  const _jpEraInfo = getJpEraInfo(d);
  return _jpEraInfo.isValid
    ? `${d.getFullYear()}(${_jpEraInfo.label.replace('年', '')})`
    : '';
};

/**
 * 1. 和暦表示用 RangeText (オーバーライド)
 */
const EraRangeText = (api: DatePickerApiObject) => {
  const year = api.visibleRange.start.year;

  // format2JpEra からカッコ内の元号部分のみを抽出して利用
  const eraLabel = format2JpEra(`${year}-01-01`).split('(')[1] ?? '';

  return (
    <span>
      <ArkDate.RangeText />
      {api.view !== 'year' && eraLabel && (
        <span class="ml-1 opacity-70">({eraLabel}</span>
      )}
    </span>
  );
};

/**
 * 2. 和暦表示用 Control (オーバーライド)
 */
const renderEraControl = (
  _api: DatePickerApiObject,
  styles: DatePickerViewStyles,
  options: { placeholder?: string },
) => {
  return (
    <div class={styles.inputGroup()}>
      <ArkDate.Input
        class={styles.input()}
        placeholder={options.placeholder ?? '日付を選択 (例: 令和...)'}
      />
      <ArkDate.Control class={styles.inputIcon()}>
        <ArkDate.Trigger>
          <CalendarIcon size={16} />
        </ArkDate.Trigger>
      </ArkDate.Control>
    </div>
  );
};

/**
 * EraDatePicker 実装
 */
export const EraDatePicker = (props: DatePickerRootProps) => {
  return (
    <DatePickerRoot
      {...props}
      // 表示ロジックの注入 (DI)
      renderRangeText={EraRangeText}
      renderControl={renderEraControl}
      renderContent={(api, styles) =>
        // 共通の骨格を使いつつ、このコンポーネントで定義した RangeText ロジックを渡す
        renderCommonContent(api, styles, {
          renderRangeText: EraRangeText,
        })
      }
    />
  );
};
