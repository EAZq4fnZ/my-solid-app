// src/components/ui/DatePicker/patterns/eraParts.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';
import { Show } from 'solid-js';

import { dateUtils, formatCustom } from '@/lib/date';
import type { DatePickerApiObject, DatePickerViewStyles } from '../types';

/**
 * 【和暦対応】日付を和暦に変換する
 * 例: "2026-05-11" => "2026(令和08)"
 */
export const format2JpEra = (isoDate: string | undefined): string => {
  if (!isoDate || !dateUtils.isValid(isoDate)) return '';

  // テンプレートに'YYYY(ENEYT)'を指定 (例: "2026-05-11" => "2026(令和08)")
  return formatCustom(isoDate, 'YYYY(ENEYT)');
};

/**
 * 【和暦対応】RangeText (カレンダー上部の年月表示) をオーバーライド
 * @param api DatePickerApi オブジェクト (コンテキストから取得)
 * @returns 和暦表示用 RangeText (オーバーライド)
 */
export const renderEraRangeText = (api: DatePickerApiObject) => {
  // カレンダー上部の年月を取得
  const year = api.visibleRange.start.year;
  const month = api.visibleRange.start.month;

  const safeIsoStr = `${year}-${String(month).padStart(2, '0')}-01`; // "2026-05-01"

  // テンプレートに 'ENEYT' を指定(例: "2026-05-01" => "令和08")
  const eraLabel = dateUtils.isValid(safeIsoStr)
    ? formatCustom(safeIsoStr, 'ENEYT')
    : '';

  return (
    <span class="flex items-center gap-1">
      <ArkDate.RangeText />

      <Show when={api.view !== 'year' && eraLabel}>
        <span class="text-zinc-400 font-normal">({eraLabel})</span>
      </Show>
    </span>
  );
};

/**【和暦対応】Control (インプットフィールド部分)のレンダリングをオーバーライド */
export const renderEraControl = (
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
/*export const renderEraControl = (
  api: DatePickerApiObject,
  styles: DatePickerViewStyles,
  options: { placeholder?: string },
) => {
  return (
    <div class={styles.control()}>
      <div class="relative flex-1">
        <input
          value={format2JpEra(api.valueAsString[0])}
          placeholder={options.placeholder ?? '選択されていません'}
          class={styles.input()}
          readonly
        />
        <ArkDate.Trigger class={styles.trigger()}>
          <CalendarIcon size={16} />
        </ArkDate.Trigger>
      </div>
    </div>
  );
};*/
