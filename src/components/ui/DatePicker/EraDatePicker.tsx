// src/components/ui/DatePicker/EraDatePicker.tsx
import { type JSX, Show, createMemo } from 'solid-js';

import type { IsoDateString } from '@/types/date';
import { dateUtils, formatCustom } from '@/lib/date';

interface EraDatePickerProps {
  value: IsoDateString | null;
  onDateChange: (value: IsoDateString | null) => void;
}

export const EraDatePicker = (props: EraDatePickerProps) => {
  // アクセシビリティ（Label紐付け）のためのユニークなID
  const inputId = 'era-date-picker-input';

  // 選択された日付から和暦情報を計算
  const displayEraText = createMemo(() => {
    const currentValidDate = props.value;
    if (!currentValidDate) return null;
    return formatCustom(currentValidDate, 'YYYY(ENEYT)/MM/DD'); // "2026-05-17" -> "2026(令和08)/05/17"
  });

  // 日付が変更された時のハンドラー
  const handleRawChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    const inputValue = e.currentTarget.value;
    if (dateUtils.isValid(inputValue)) {
      props.onDateChange(inputValue as IsoDateString);
    } else {
      props.onDateChange(null);
    }
  };

  return (
    <div class="flex flex-col gap-2 p-4 rounded-lg border border-zinc-800 bg-zinc-950">
      <label for={inputId} class="text-sm font-medium text-zinc-400">
        対象年月日
      </label>

      {/* 画面のヘッダー表示部分 */}
      <div class="h-8 flex items-center text-lg font-bold text-zinc-100 font-mono">
        <Show
          when={displayEraText()}
          fallback={
            <span class="text-zinc-600 text-sm font-normal">
              日付が選択されていません
            </span>
          }
        >
          {(text) => <span>{text()}</span>}
        </Show>
      </div>

      <input
        id={inputId}
        type="date"
        value={props.value ?? ''}
        onChange={handleRawChange}
        class="h-11 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none color-scheme-dark"
      />
    </div>
  );
};
