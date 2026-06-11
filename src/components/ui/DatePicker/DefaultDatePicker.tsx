// src/components/ui/DatePicker/DefaultDatePicker.tsx
import { splitProps, Index } from 'solid-js';
import { Portal } from 'solid-js/web';

import { DateInput as ArkDateInput, useDateInput } from '@ark-ui/solid/date-input';
import { DatePicker as ArkDatePicker, useDatePicker } from '@ark-ui/solid/date-picker';
import { LocaleProvider } from '@ark-ui/solid/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';

import { Field } from '../Field';
import { datePickerStyles } from './types';
import type { EraDatePickerProps } from './types';

export const DefaultDatePicker = (props: EraDatePickerProps) => {
  const [local, variantProps] = splitProps(
    props,
    [
      'value',
      'onValueChange',
      'label',
      'error',
      'helperText',
      'required',
      'granularity',
      'selectionMode',
      'calendarId',
      'arkLocale',
      'timeZone',
      'inputPlaceholder',
    ],
    ['disabled', 'readOnly'],
  );

  // カレンダーエンジン側の初期化
  const datePicker = useDatePicker({
    value: local.value,
    selectionMode: local.selectionMode ?? 'single',
    disabled: variantProps.disabled,
    readOnly: variantProps.readOnly,
    timeZone: local.timeZone,
    onValueChange: (details) => {
      local.onValueChange(details.value);
    },
  });

  // 手入力セグメント側の初期化
  const dateInput = useDateInput(() => ({
    value: datePicker().value,
    disabled: variantProps.disabled,
    readOnly: variantProps.readOnly,
    timeZone: local.timeZone,
    onValueChange(details) {
      datePicker().setValue(details.value);
    },
  }));

  return (
    <Field
      label={local.label}
      error={local.error}
      helperText={local.helperText}
      required={local.required}
    >
      <LocaleProvider locale={local.arkLocale}>
        <ArkDateInput.RootProvider value={dateInput}>
          <ArkDateInput.Control class={datePickerStyles.inputGroup()}>
            <ArkDatePicker.RootProvider value={datePicker}>
              <ArkDatePicker.Control class="flex items-center justify-between w-full gap-2">
                
                {/* インライン手入力セグメント（和暦ロケール時は自動的に元号入力パーツに変化） */}
                <ArkDateInput.SegmentGroup class="flex items-center gap-0.5">
                  <ArkDateInput.SegmentContext>
                    {(segment) => (
                      <ArkDateInput.Segment
                        segment={segment}
                        class="px-0.5 text-sm font-mono text-zinc-100 focus:bg-zinc-800 focus:text-white rounded outline-none data-placeholder:text-zinc-500"
                      />
                    )}
                  </ArkDateInput.SegmentContext>
                </ArkDateInput.SegmentGroup>

                {/* ポップアップトリガーボタン */}
                <ArkDatePicker.Trigger class="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer p-1">
                  <CalendarIcon size={18} />
                </ArkDatePicker.Trigger>
              </ArkDatePicker.Control>

              {/* ポップアップカレンダー */}
              <Portal>
                <ArkDatePicker.Positioner>
                  <ArkDatePicker.Content class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-2xl z-50 min-w-70">
                    <ArkDatePicker.Context>
                      {(dp) => (
                        <>
                          {/* --- Day View (日表示) --- */}
                          <ArkDatePicker.View view="day" class="flex flex-col gap-3">
                            <ArkDatePicker.ViewControl class="flex items-center justify-between">
                              <ArkDatePicker.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronLeftIcon size={18} />
                              </ArkDatePicker.PrevTrigger>
                              <ArkDatePicker.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium text-sm transition-colors text-zinc-100 cursor-pointer">
                                <ArkDatePicker.RangeText />
                              </ArkDatePicker.ViewTrigger>
                              <ArkDatePicker.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronRightIcon size={18} />
                              </ArkDatePicker.NextTrigger>
                            </ArkDatePicker.ViewControl>

                            <ArkDatePicker.Table class="w-full border-collapse">
                              <ArkDatePicker.TableHead>
                                <ArkDatePicker.TableRow class="flex justify-around w-full mb-1">
                                  <Index each={dp().weekDays}>
                                    {(weekDay) => (
                                      <ArkDatePicker.TableHeader class="text-xs font-medium text-zinc-500 w-8 text-center select-none">
                                        {weekDay().short}
                                      </ArkDatePicker.TableHeader>
                                    )}
                                  </Index>
                                </ArkDatePicker.TableRow>
                              </ArkDatePicker.TableHead>
                              <ArkDatePicker.TableBody>
                                <Index each={dp().weeks}>
                                  {(week) => (
                                    <ArkDatePicker.TableRow class="flex justify-around w-full gap-y-1">
                                      <Index each={week()}>
                                        {(day) => (
                                          <ArkDatePicker.TableCell value={day()} class="w-8 h-8 flex items-center justify-center">
                                            <ArkDatePicker.TableCellTrigger class="w-7 h-7 text-sm rounded-md flex items-center justify-center text-zinc-200 hover:bg-zinc-800 transition-colors data-selected:bg-zinc-100 data-selected:text-zinc-950 data-disabled:opacity-30 data-disabled:hover:bg-transparent select-none cursor-pointer">
                                              {day().day}
                                            </ArkDatePicker.TableCellTrigger>
                                          </ArkDatePicker.TableCell>
                                        )}
                                      </Index>
                                    </ArkDatePicker.TableRow>
                                  )}
                                </Index>
                              </ArkDatePicker.TableBody>
                            </ArkDatePicker.Table>
                          </ArkDatePicker.View>

                          {/* --- Month View (月表示) --- */}
                          <ArkDatePicker.View view="month" class="flex flex-col gap-3">
                            <ArkDatePicker.ViewControl class="flex items-center justify-between">
                              <ArkDatePicker.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronLeftIcon size={18} />
                              </ArkDatePicker.PrevTrigger>
                              <ArkDatePicker.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium text-sm transition-colors text-zinc-100 cursor-pointer">
                                <ArkDatePicker.RangeText />
                              </ArkDatePicker.ViewTrigger>
                              <ArkDatePicker.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronRightIcon size={18} />
                              </ArkDatePicker.NextTrigger>
                            </ArkDatePicker.ViewControl>

                            <ArkDatePicker.Table class="w-full">
                              <ArkDatePicker.TableBody>
                                <Index each={dp().getMonthsGrid({ columns: 4, format: 'short' })}>
                                  {(months) => (
                                    <ArkDatePicker.TableRow class="flex w-full justify-around mb-2">
                                      <Index each={months()}>
                                        {(month) => (
                                          <ArkDatePicker.TableCell value={month().value} class="flex-1 flex justify-center">
                                            <ArkDatePicker.TableCellTrigger class="px-3 py-1.5 text-sm rounded-md text-zinc-200 hover:bg-zinc-800 transition-colors data-selected:bg-zinc-100 data-selected:text-zinc-950 select-none w-full text-center cursor-pointer">
                                              {month().label}
                                            </ArkDatePicker.TableCellTrigger>
                                          </ArkDatePicker.TableCell>
                                        )}
                                      </Index>
                                    </ArkDatePicker.TableRow>
                                  )}
                                </Index>
                              </ArkDatePicker.TableBody>
                            </ArkDatePicker.Table>
                          </ArkDatePicker.View>

                          {/* --- Year View (年表示) --- */}
                          <ArkDatePicker.View view="year" class="flex flex-col gap-3">
                            <ArkDatePicker.ViewControl class="flex items-center justify-between">
                              <ArkDatePicker.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronLeftIcon size={18} />
                              </ArkDatePicker.PrevTrigger>
                              <ArkDatePicker.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium text-sm transition-colors text-zinc-100 cursor-pointer">
                                <ArkDatePicker.RangeText />
                              </ArkDatePicker.ViewTrigger>
                              <ArkDatePicker.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors text-zinc-200 cursor-pointer">
                                <ChevronRightIcon size={18} />
                              </ArkDatePicker.NextTrigger>
                            </ArkDatePicker.ViewControl>

                            <ArkDatePicker.Table class="w-full">
                              <ArkDatePicker.TableBody>
                                <Index each={dp().getYearsGrid({ columns: 4 })}>
                                  {(years) => (
                                    <ArkDatePicker.TableRow class="flex w-full justify-around mb-2">
                                      <Index each={years()}>
                                        {(year) => (
                                          <ArkDatePicker.TableCell value={year().value} class="flex-1 flex justify-center">
                                            <ArkDatePicker.TableCellTrigger class="px-3 py-1.5 text-sm rounded-md text-zinc-200 hover:bg-zinc-800 transition-colors data-selected:bg-zinc-100 data-selected:text-zinc-950 select-none w-full text-center cursor-pointer">
                                              {year().label}
                                            </ArkDatePicker.TableCellTrigger>
                                          </ArkDatePicker.TableCell>
                                        )}
                                      </Index>
                                    </ArkDatePicker.TableRow>
                                  )}
                                </Index>
                              </ArkDatePicker.TableBody>
                            </ArkDatePicker.Table>
                          </ArkDatePicker.View>
                        </>
                      )}
                    </ArkDatePicker.Context>
                  </ArkDatePicker.Content>
                </ArkDatePicker.Positioner>
              </Portal>

            </ArkDatePicker.RootProvider>
          </ArkDateInput.Control>
          <ArkDateInput.HiddenInput />
        </ArkDateInput.RootProvider>
      </LocaleProvider>
    </Field>
  );
};