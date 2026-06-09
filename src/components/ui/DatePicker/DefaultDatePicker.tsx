// src/components/ui/DatePicker/DefaultDatePicker.tsx
import { DatePicker as ArkDatePicker, useDatePicker } from '@ark-ui/solid';
import { CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { createMemo, createSignal, Show, splitProps } from 'solid-js';
import { formatCustom, parseDate, parseDateTime } from '@/lib/date';
import { Field } from '../Field'; 
import { BaseDateInput } from './BaseDateInput';
import { renderCommonContent } from './patterns/commonContent';
import { datePickerStyles, type BaseDatePickerProps } from './types';
import { IsoDateString, IsoDateTimeString } from '@/types/date';

export const DefaultDatePicker = (props: BaseDatePickerProps) => {
  const [local, variantProps, restProps] = splitProps(
    props,
    ['value', 'onValueChange', 'label', 'error', 'helperText', 'optional', 'template', 'granularity'],
    ['disabled', 'readOnly']
  );

  const TIME_ZONE = 'UTC';

  const [isFocused, setIsFocused] = createSignal(false);
  const granularity = () => local.granularity ?? 'day';

  const template = () =>
    local.template ?? (granularity() === 'minute' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD');

  const formattedValue = createMemo(() => {
    if (!local.value) return '';
    return formatCustom(local.value, template());
  });

  const placeholderText = () =>
    granularity() === 'minute' ? '2026/06/08 12:00' : '2026/06/08';

  const machineValue = () => {
    if (!local.value) return [];
    try {
      return [granularity() === 'minute' ? parseDateTime(local.value) : parseDate(local.value)];
    } catch {
      return [];
    }
  };

  // useDatePicker の引数は createMemo を使わず、元のプレーンな関数参照に戻し、型を any 判定で安全に流します
  const datePicker = useDatePicker(() => ({
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
          timeZone: TIME_ZONE,
        });
        local.onValueChange(isoDateTime.toString({calendarName: 'never', timeZoneName: 'never', offset: 'auto', fractionalSecondDigits: 0}) as IsoDateTimeString);
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
                when={isFocused() && !variantProps.readOnly && !variantProps.disabled}
                fallback={
                  <div
                    class={datePickerStyles.inputGroup()}
                    tabIndex={variantProps.disabled ? -1 : 0}
                    onFocus={() => setIsFocused(true)}
                    id={api().getInputProps().id}
                  >
                    <span class={datePickerStyles.displayText()}>
                      {formattedValue() || <span class="text-zinc-500">{placeholderText()}</span>}
                    </span>
                  </div>
                }
              >
                <div onFocusIn={() => setIsFocused(true)} onFocusOut={() => setIsFocused(false)}>
                  <BaseDateInput api={datePicker} />
                </div>
              </Show>

              {/* 安全に追加されたカレンダーのポップアップ表示層 */}
              <ArkDatePicker.Positioner>
                <ArkDatePicker.Content class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-2xl z-50 absolute left-0 top-[105%] mt-1 min-w-[280px]">
                  {renderCommonContent(api, datePickerStyles, {
                    renderRangeText: (currentApi) => currentApi().visibleRangeText ?? '',
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