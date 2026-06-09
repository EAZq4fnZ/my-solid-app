// src/components/ui/DatePicker/BaseDateInput.tsx
import { DateInput as ArkDateInput } from '@ark-ui/solid';
import { datePickerStyles } from './types';

interface BaseDateInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: Ark UI 内部の複雑なコンテキスト型マッピングを回避するため any を許容
  api: any;
}

/**
 * フォーカスイン時に表示される、標準の yyyy/mm/dd (hh:mm) 手入力セグメント
 */
export const BaseDateInput = (props: BaseDateInputProps) => {
  return (
    <ArkDateInput.Control class={datePickerStyles.inputGroup()}>
      {/* SegmentContext は内部で自動ループし、各セグメント（DateSegment オブジェクト）を直接渡してきます */}
      <ArkDateInput.SegmentContext>
        {(segment) => (
          <>
            {/* segment は関数ではないオブジェクトなので、そのまま segment 属性に渡します */}
            <ArkDateInput.Segment
              segment={segment}
              class="px-0.5 text-sm font-mono text-zinc-100 focus:bg-zinc-800 focus:text-white rounded outline-none data-placeholder:text-zinc-500"
            />
          </>
        )}
      </ArkDateInput.SegmentContext>
    </ArkDateInput.Control>
  );
};
