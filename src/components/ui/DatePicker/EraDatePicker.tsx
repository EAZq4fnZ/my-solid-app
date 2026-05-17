// src/components/ui/DatePicker/EraDatePicker.tsx
import { IsoDateString, type JpEraInfo } from '@/utils/dateUtils';
import { type JSX, Show, createMemo } from 'solid-js';

interface EraDatePickerProps {
  value: IsoDateString | null;
  onDateChange: (value: IsoDateString | null) => void;
}

export const EraDatePicker = (props: EraDatePickerProps) => {
  // アクセシビリティ（Label紐付け）のためのユニークなID
  const inputId = 'era-date-picker-input';

  // 選択された日付から和暦情報を計算（派生状態）
  const eraInfo = createMemo<JpEraInfo | null>(() => {
    const currentValidDate = props.value;
    if (!currentValidDate) return null;
    return IsoDateString.getJpEraInfo(currentValidDate);
  });

  // 日付が変更された時のハンドラー
  const handleRawChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    const inputValue = e.currentTarget.value;
    if (IsoDateString.isValid(inputValue)) {
      props.onDateChange(inputValue);
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
          when={eraInfo()}
          fallback={
            <span class="text-zinc-600 text-sm font-normal">
              日付が選択されていません
            </span>
          }
        >
          {(info) =>
            // JpEraInfoから表示を組み立て 例：2026(令和8)/5/17
            `${info().year}(${info().eraText})/${info().month}/${info().day}`
          }
        </Show>
      </div>

      <input
        id={inputId}
        type="date"
        value={props.value ?? ''}
        onChange={handleRawChange}
        class="h-11 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none color-scheme-dark"
      />

      {/* 略称表示部分 */}
      <Show when={eraInfo()}>
        {(info) => (
          <span class="text-xs text-zinc-500">
            略称表記: {info().eraAlphaText}年
          </span>
        )}
      </Show>
    </div>
  );
};
