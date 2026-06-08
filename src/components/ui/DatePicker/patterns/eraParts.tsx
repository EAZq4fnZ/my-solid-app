// src/components/ui/DatePicker/patterns/eraParts.tsx
import {
  DateInput as ArkDateInput,
  DatePicker as ArkDatePicker,
} from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';
import { For } from 'solid-js';

import { formatCustom } from '@/lib/date';
import type {
  DateInputApiObject,
  DatePickerApiObject,
  DatePickerViewStyles,
} from '../type';

/**
 * 【和暦対応】ビューモードを判定し、カレンダーヘッダー文字列をレンダリングする
 */
export const renderEraRangeText = (api: DatePickerApiObject) => {
  const view = api.view;

  if (view === 'year') {
    const startYear = Math.floor(api.focusedValue.year / 10) * 10;
    return (
      <span class="text-zinc-100 font-medium">
        {startYear}年 〜 {startYear + 9}年
      </span>
    );
  }

  if (view === 'month') {
    const year = api.focusedValue.year;
    const dummyIso = `${year}-01-01`;
    const eraYearText = formatCustom(dummyIso, 'ENEYT年');
    return <span class="text-zinc-100 font-medium">{eraYearText}</span>;
  }

  const start = api.visibleRange.start;
  const isoStr = `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`;
  const eraText = formatCustom(isoStr, 'ENEYT年MM月');

  return <span class="text-zinc-100 font-medium">{eraText}</span>;
};

/**
 * 【和暦対応】DateInputのセグメント構造を主軸にしたControl部分のオーバーライド
 */
export const renderEraControl = (
  dateInputApi: DateInputApiObject,
  _datePickerApi: DatePickerApiObject,
  styles: DatePickerViewStyles,
  _options: { placeholder?: string; editable?: boolean },
) => {
  return (
    <div class={styles.inputGroup()}>
      {/* 🌟 Ark UI の正規エクスポートである Field と parts プロパティを使用してループを回します */}
      <ArkDateInput.Field class={styles.inputField()}>
        <For each={dateInputApi.parts}>
          {(segment) => (
            <ArkDateInput.Segment segment={segment} class={styles.segment()} />
          )}
        </For>
      </ArkDateInput.Field>

      {/* カレンダー起動トリガー */}
      <div class={styles.inputIcon()}>
        <ArkDatePicker.Trigger>
          <CalendarIcon size={16} />
        </ArkDatePicker.Trigger>
      </div>
    </div>
  );
};
