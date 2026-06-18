// src/components/ui/DatePicker/DefaultDatePicker.tsx
import { splitProps, Index, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { tv } from 'tailwind-variants';

import {
  DateInput as ArkDateInput,
  useDateInput,
} from '@ark-ui/solid/date-input';
import {
  DatePicker as ArkDatePicker,
  useDatePicker,
} from '@ark-ui/solid/date-picker';
import { LocaleProvider } from '@ark-ui/solid/locale';


import type { DatePickerProps } from './core';
import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';

const datePickerStyles = tv({
  extend: fieldStyles,
  slots: {
    // 既存の slots (root, label等) を継承
    // DatePicker固有のスタイルをここに追加
    segmentGroup: 'flex items-center gap-1 p-2 border rounded-md bg-zinc-950',
    segment: 'text-sm font-mono text-zinc-100',
  },
});

export const DatePicker = (props: DatePickerProps) => {
  // DatePickerのロジック初期化
  const datePicker = useDatePicker({
    value: props.state.value,
    onValueChange: (details) => props.state.onValueChange(details.value),
    selectionMode: props.status.selectionMode ?? 'single',
    disabled: props.status.disabled,
    readOnly: props.status.readOnly,
    locale: props.config.locale,
    timeZone: props.config.timeZone,
  });

  // DateInputのロジック初期化
  const dateInput = useDateInput({
    value: datePicker().value,
    onValueChange: (details) => datePicker().setValue(details.value),
    disabled: props.status.disabled,
    readOnly: props.status.readOnly,
    locale: props.config.locale,
    timeZone: props.config.timeZone,
  });

  const styles = datePickerStyles();

  return (
    <Field field={props.field} status={props.status} className={props.className}>
      <LocaleProvider locale={props.config.locale}>
        <ArkDateInput.RootProvider value={dateInput}>
          <ArkDateInput.Control className={styles.segmentGroup()}>
            <ArkDateInput.SegmentGroup className="flex gap-1">
              <ArkDateInput.SegmentContext>
                {(segment) => <ArkDateInput.Segment segment={segment} className="p-1" />}
              </ArkDateInput.SegmentContext>
            </ArkDateInput.SegmentGroup>
            
            <ArkDatePicker.RootProvider value={datePicker}>
              <ArkDatePicker.Trigger className="p-2">
                <CalendarIcon size={16} />
              </ArkDatePicker.Trigger>

              <Portal>
                <ArkDatePicker.Positioner>
                  <ArkDatePicker.Content className="bg-zinc-900 p-4 rounded-lg shadow-xl border border-zinc-800">
                    <ArkDatePicker.View view="day">
                      <DatePickerHeader />
                      <DatePickerTable type="day" />
                    </ArkDatePicker.View>
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

// ヘッダー部分の共通化（必要に応じて切り出し）
const DatePickerHeader = () => (
  <ArkDatePicker.ViewControl className="flex justify-between items-center mb-4">
    <ArkDatePicker.PrevTrigger><ChevronLeftIcon size={16} /></ArkDatePicker.PrevTrigger>
    <ArkDatePicker.ViewTrigger><ArkDatePicker.RangeText /></ArkDatePicker.ViewTrigger>
    <ArkDatePicker.NextTrigger><ChevronRightIcon size={16} /></ArkDatePicker.NextTrigger>
  </ArkDatePicker.ViewControl>
);

// テーブル部分の共通化
const DatePickerTable = (props: { type: 'day' | 'month' | 'year' }) => (
  <ArkDatePicker.Table>
    <ArkDatePicker.TableBody>
      <ArkDatePicker.Context>
        {(api) => (
          <Index each={api().weeks}>
            {(week) => (
              <ArkDatePicker.TableRow>
                <Index each={week()}>
                  {(day) => (
                    <ArkDatePicker.TableCell value={day()}>
                      <ArkDatePicker.TableCellTrigger>{day().day}</ArkDatePicker.TableCellTrigger>
                    </ArkDatePicker.TableCell>
                  )}
                </Index>
              </ArkDatePicker.TableRow>
            )}
          </Index>
        )}
      </ArkDatePicker.Context>
    </ArkDatePicker.TableBody>
  </ArkDatePicker.Table>
);