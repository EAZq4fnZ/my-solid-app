// src/components/ui/DatePicker/patterns/eraParts.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';
import { Show } from 'solid-js';
import { getJpEraInfo } from '@/utils/dateUtils';
import type { DatePickerApiObject, DatePickerViewStyles } from '../types';

/**
 * 西暦から和暦への変換ユーティリティ
 * 例: "2026-05-11" => "2026(令和8)"
 */
export const format2JpEra = (isoDate: string | undefined): string => {
  if (!isoDate) return '';
  const d = new Date(isoDate);

  if (Number.isNaN(d.getTime())) return '';

  const _jpEraInfo = getJpEraInfo(d);
  return _jpEraInfo.isValid
    ? `${d.getFullYear()}(${_jpEraInfo.label.replace('年', '')})`
    : '';
};

/**
 * 【和暦対応】RangeText (カレンダー上部の年月表示)
 * Java のメソッドオーバーライドに相当する部分です。
 */
export const renderEraRangeText = (api: DatePickerApiObject) => {
  const year = api.visibleRange.start.year;

  // yyyy-01-01 形式で和暦情報を取得
  const eraLabel = format2JpEra(`${year}-01-01`).split('(')[1] ?? '';

  return (
    <span class="flex items-center gap-1">
      <ArkDate.RangeText />
      {/* 年表示ビュー以外で、かつ和暦が有効な場合に表示 */}
      <Show when={api.view !== 'year' && eraLabel}>
        <span class="text-zinc-400 font-normal">({eraLabel}</span>
      </Show>
    </span>
  );
};

/**
 * 【和暦対応】Control (インプットフィールド部分)
 * Biome エラー回避のため、未使用の api にはアンダースコアを付与
 */
export const renderEraControl = (
  _api: DatePickerApiObject,
  styles: DatePickerViewStyles,
  options: { placeholder?: string },
) => {
  return (
    <div class={styles.inputGroup()}>
      <ArkDate.Input
        class={styles.input()}
        placeholder={options.placeholder ?? '日付を選択 (和暦対応)'}
      />
      <ArkDate.Control class={styles.inputIcon()}>
        <ArkDate.Trigger>
          <CalendarIcon size={16} />
        </ArkDate.Trigger>
      </ArkDate.Control>
    </div>
  );
};
