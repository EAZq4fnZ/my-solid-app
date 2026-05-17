// src/components/ui/DatePicker/patterns/eraParts.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';
import { Show } from 'solid-js';

// 💡 修正: 新しいブランド型オブジェクトをインポート
import { IsoDateString } from '@/utils/dateUtils';
import type { DatePickerApiObject, DatePickerViewStyles } from '../types';

/**
 * 【和暦対応】日付を和暦に変換する
 * 例: "2026-05-11" => "2026(令和8)"
 * @param isoDate ルーズな日付文字列
 * @returns 和暦文字列（不正な場合は空文字）
 */
export const format2JpEra = (isoDate: string | undefined): string => {
  if (!isoDate || !IsoDateString.isValid(isoDate)) return '';

  // 💡 安全性が型レベルで保証されたため、1行でパーツを組み立て可能
  const info = IsoDateString.getJpEraInfo(isoDate);

  // info.year (西暦) と info.eraText (令和8) を結合
  return `${info.year}(${info.eraText})`;
};

/**
 * 【和暦対応】RangeText (カレンダー上部の年月表示)
 * @param api DatePickerApi オブジェクト (コンテキストから取得)
 * @returns 和暦表示用 RangeText (オーバーライド)
 */
export const renderEraRangeText = (api: DatePickerApiObject) => {
  // api.visibleRange.start.year から安全な IsoDateString を生成
  const year = api.visibleRange.start.year;
  const dummyIso = IsoDateString.fromFields(year, 1, 1);

  // 💡 泥臭い文字列の split 分解を廃止し、ドメインから直接「元号＋和暦」を取得
  const info = IsoDateString.getJpEraInfo(dummyIso);
  const eraLabel = info.eraText; // "令和8" や "令和元" などが直接手に入る

  return (
    <span class="flex items-center gap-1">
      <ArkDate.RangeText />
      <Show when={api.view !== 'year' && eraLabel}>
        {/* 💡 最後に閉じカッコ「)」を付与するデザインに準拠 */}
        <span class="text-zinc-400 font-normal">({eraLabel})</span>
      </Show>
    </span>
  );
};

/**
 * 【和暦対応】Control (インプットフィールド部分)
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
