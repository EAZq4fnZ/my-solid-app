// src/components/ui/DatePicker/EraDatePicker.tsx
import { DatePicker as ArkDatePicker, useDatePicker } from '@ark-ui/solid';
import { CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { createMemo, createSignal, Show, splitProps } from 'solid-js';

import { Field } from '../Field';
import { BaseDateInput } from './BaseDateInput';
import { renderCommonContent } from './patterns/commonContent';
import { renderEraRangeText } from './patterns/eraParts';
import { datePickerStyles, type BaseDatePickerProps } from './types';
import { formatCustom, parseDate, parseDateTime } from '@/lib/date';
import type { IsoDateTimeString, IsoDateString } from '@/types/date';

const JP_TIME_ZONE = 'Asia/Tokyo';

export const JpEraDatePicker = (props: BaseDatePickerProps) => {
  const [local, variantProps] = splitProps(
    props,
    [
      'value',
      'onValueChange',
      'label',
      'error',
      'helperText',
      'optional',
      'template',
      'granularity',
    ],
    ['disabled', 'readOnly'],
  );

  const [isFocused, setIsFocused] = createSignal(false);
  const granularity = () => local.granularity ?? 'day';

  const template = () =>
    local.template ??
    (granularity() === 'minute'
      ? 'YYYY(ENEYT)/MM/DD HH:mm'
      : 'YYYY(ENEYT)/MM/DD');

  const formattedValue = createMemo(() => {
    if (!local.value) return '';
    return formatCustom(local.value, template());
  });

  const placeholderText = () =>
    granularity() === 'minute' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD';

  const machineValue = () => {
    if (!local.value) return [];
    try {
      return [
        granularity() === 'minute'
          ? parseDateTime(local.value)
          : parseDate(local.value),
      ];
    } catch {
      return [];
    }
  };

  const datePicker = useDatePicker(() => ({
    // biome-ignore lint/suspicious/noExplicitAny: Ark UI 内部マシーンの型競合を回避するため any キャストを許容
    value: machineValue() as any,
    disabled: variantProps.disabled,
    readOnly: variantProps.readOnly,
    granularity: granularity(),
    selectionMode: 'single',
    onValueChange: (details) => {
      const dateValue = details.value[0];
      if (!dateValue) {
        local.onValueChange(null);
        return;
      }

      if (granularity() === 'minute' && dateValue instanceof CalendarDateTime) {
        const isoDateTime = Temporal.ZonedDateTime.from({
          year: dateValue.year,
          month: dateValue.month,
          day: dateValue.day,
          hour: dateValue.hour,
          minute: dateValue.minute,
          timeZone: JP_TIME_ZONE,
        }).toString({
          calendarName: 'never',
          timeZoneName: 'never',
          offset: 'auto',
          fractionalSecondDigits: 0,
        });
        local.onValueChange(isoDateTime as IsoDateTimeString);
      } else {
        const isoDate = `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}`;
        local.onValueChange(isoDate as IsoDateString);
      }
    },
  }));

  return (
    <Field
      label={local.label}
      error={local.error}
      helperText={local.helperText}
      optional={local.optional}
    >
      <ArkDatePicker.RootProvider value={datePicker}>
        <ArkDatePicker.Context>
          {(api) => (
            <div class="w-full flex flex-col relative">
              <Show
                when={
                  isFocused() &&
                  !variantProps.readOnly &&
                  !variantProps.disabled
                }
                fallback={
                  // Biome対策: エラーの原因だった div + role="button" を本物の <button> タグに変更！
                  // button の規定の送信挙動（type="submit"）を防ぐために type="button" を明記
                  <button
                    type="button"
                    class={datePickerStyles.inputGroup()}
                    tabIndex={variantProps.disabled ? -1 : 0}
                    onFocus={() => setIsFocused(true)}
                    id={api().getInputProps().id}
                  >
                    <span class={datePickerStyles.displayText()}>
                      {formattedValue() || (
                        <span class="text-zinc-500">{placeholderText()}</span>
                      )}
                    </span>
                  </button>
                }
              >
                <div
                  onFocusIn={() => setIsFocused(true)}
                  onFocusOut={() => setIsFocused(false)}
                >
                  <BaseDateInput api={datePicker} />
                </div>
              </Show>

              {/* ポップアップカレンダーレイ層 */}
              <ArkDatePicker.Positioner>
                <ArkDatePicker.Content class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-2xl z-50 absolute left-0 top-[105%] mt-1 min-w-70">
                  {renderCommonContent(api, datePickerStyles, {
                    // biome-ignore lint/suspicious/noExplicitAny: コールバック引数の暗黙的な any 警告を無視
                    renderRangeText: (currentApi: any) =>
                      renderEraRangeText(currentApi),
                  })}
                </ArkDatePicker.Content>
              </ArkDatePicker.Positioner>
            </div>
          )}
        </ArkDatePicker.Context>
      </ArkDatePicker.RootProvider>
    </Field>
  );
};
