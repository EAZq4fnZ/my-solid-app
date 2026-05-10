import {
  DatePicker as ArkDate,
  type UseDatePickerContext,
} from '@ark-ui/solid';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { Index, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from './Field';
import { fieldStyles } from './sharedStyles';

export const datePickerStyles = tv({
  extend: fieldStyles,
  slots: {
    content: [
      'z-50 bg-zinc-900 border border-zinc-800 rounded-md p-4 shadow-2xl outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    ],
    viewControl: 'flex items-center justify-between mb-4 text-zinc-100',
    table: 'w-full border-separate border-spacing-1',
    tableHeader:
      'text-zinc-500 font-medium text-xs w-8 h-8 flex items-center justify-center',
    day: [
      'w-8 h-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors relative',
      'text-zinc-200 hover:bg-zinc-800',
      'data-[selected]:bg-zinc-100 data-[selected]:text-zinc-950 data-[selected]:font-bold',
      'data-[today]:after:content-[""] data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:w-1 data-[today]:after:h-1 data-[today]:after:bg-amber-500 data-[today]:after:rounded-full',
      // 土日の色付け
      'data-[weekend=sun]:text-red-400',
      'data-[weekend=sat]:text-blue-400',
      // 無効化（最優先で上書き）
      'data-[disabled]:text-zinc-700 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent data-[disabled]:opacity-50',
    ],
    inputGroup: 'relative flex items-center w-full',
    inputIcon:
      'absolute right-3 text-zinc-500 hover:text-zinc-100 cursor-pointer z-10',
  },
});

type DatePickerVariantProps = VariantProps<typeof datePickerStyles>;
export interface DatePickerProps
  extends ArkDate.RootProps,
    DatePickerVariantProps {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
}

interface DatePickerViewProps {
  api: UseDatePickerContext;
  styles: ReturnType<typeof datePickerStyles>;
}

export const DatePicker = (props: DatePickerProps) => {
  const [local, rootProps] = splitProps(props, [
    'label',
    'helperText',
    'error',
    'placeholder',
  ]);
  const styles = datePickerStyles();

  return (
    <Field
      label={local.label}
      helperText={local.helperText}
      error={local.error}
    >
      <ArkDate.Root {...rootProps} positioning={{ gutter: 4 }}>
        <ArkDate.Context>
          {(api) => (
            <div class="w-full">
              <ArkDate.Control class={styles.inputGroup()}>
                {/* Input単体：手入力を可能に */}
                <ArkDate.Input
                  class={styles.input()}
                  placeholder={local.placeholder}
                />
                {/* Trigger：カレンダーアイコンクリックで確実に開く */}
                <ArkDate.Trigger class={styles.inputIcon()}>
                  <CalendarIcon size={16} />
                </ArkDate.Trigger>
              </ArkDate.Control>

              <Portal>
                <ArkDate.Positioner>
                  <ArkDate.Content class={styles.content()}>
                    <DayView api={api} styles={styles} />
                    <MonthView api={api} styles={styles} />
                    <YearView api={api} styles={styles} />
                  </ArkDate.Content>
                </ArkDate.Positioner>
              </Portal>
            </div>
          )}
        </ArkDate.Context>
      </ArkDate.Root>
    </Field>
  );
};

const DayView = (props: DatePickerViewProps) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <ArkDate.View view="day">
      <ArkDate.ViewControl class={props.styles.viewControl()}>
        <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
          <ChevronLeftIcon size={18} />
        </ArkDate.PrevTrigger>
        <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
          <ArkDate.RangeText />
        </ArkDate.ViewTrigger>
        <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
          <ChevronRightIcon size={18} />
        </ArkDate.NextTrigger>
      </ArkDate.ViewControl>

      <ArkDate.Table class={props.styles.table()}>
        <ArkDate.TableHead>
          <ArkDate.TableRow class="flex">
            <Index each={props.api().weekDays}>
              {(weekDay, i) => (
                <ArkDate.TableHeader
                  class={props.styles.tableHeader()}
                  // 曜日の見出しの色付け
                  style={{
                    color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : '',
                  }}
                >
                  {weekDay().short}
                </ArkDate.TableHeader>
              )}
            </Index>
          </ArkDate.TableRow>
        </ArkDate.TableHead>
        <ArkDate.TableBody>
          <Index each={props.api().weeks}>
            {(week) => (
              <ArkDate.TableRow class="flex">
                <Index each={week()}>
                  {(day) => {
                    const date = day().toDate(tz);
                    const isSun = date.getDay() === 0;
                    const isSat = date.getDay() === 6;

                    return (
                      <ArkDate.TableCell value={day()}>
                        <ArkDate.TableCellTrigger
                          class={props.styles.day()}
                          // CSSの優先順位を利用するため、土日の属性を常に付与
                          // 無効な状態は data-disabled で自動的に上書きされる
                          data-weekend={
                            isSun ? 'sun' : isSat ? 'sat' : undefined
                          }
                        >
                          {day().day}
                        </ArkDate.TableCellTrigger>
                      </ArkDate.TableCell>
                    );
                  }}
                </Index>
              </ArkDate.TableRow>
            )}
          </Index>
        </ArkDate.TableBody>
      </ArkDate.Table>
    </ArkDate.View>
  );
};

const MonthView = (props: DatePickerViewProps) => (
  <ArkDate.View view="month">
    <ArkDate.ViewControl class={props.styles.viewControl()}>
      <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded">
        <ChevronLeftIcon size={18} />
      </ArkDate.PrevTrigger>
      <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium">
        <ArkDate.RangeText />
      </ArkDate.ViewTrigger>
      <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded">
        <ChevronRightIcon size={18} />
      </ArkDate.NextTrigger>
    </ArkDate.ViewControl>
    <ArkDate.Table class={props.styles.table()}>
      <ArkDate.TableBody>
        <Index
          each={props.api().getMonthsGrid({ columns: 4, format: 'short' })}
        >
          {(months) => (
            <ArkDate.TableRow class="flex">
              <Index each={months()}>
                {(month) => (
                  <ArkDate.TableCell value={month().value}>
                    <ArkDate.TableCellTrigger class="p-2 text-sm hover:bg-zinc-800 rounded-md flex-1 text-center text-zinc-200">
                      {month().label}
                    </ArkDate.TableCellTrigger>
                  </ArkDate.TableCell>
                )}
              </Index>
            </ArkDate.TableRow>
          )}
        </Index>
      </ArkDate.TableBody>
    </ArkDate.Table>
  </ArkDate.View>
);

const YearView = (props: DatePickerViewProps) => (
  <ArkDate.View view="year">
    <ArkDate.ViewControl class={props.styles.viewControl()}>
      <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded">
        <ChevronLeftIcon size={18} />
      </ArkDate.PrevTrigger>
      <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium">
        <ArkDate.RangeText />
      </ArkDate.ViewTrigger>
      <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded">
        <ChevronRightIcon size={18} />
      </ArkDate.NextTrigger>
    </ArkDate.ViewControl>
    <ArkDate.Table class={props.styles.table()}>
      <ArkDate.TableBody>
        <Index each={props.api().getYearsGrid({ columns: 4 })}>
          {(years) => (
            <ArkDate.TableRow class="flex">
              <Index each={years()}>
                {(year) => (
                  <ArkDate.TableCell value={year().value}>
                    <ArkDate.TableCellTrigger class="p-2 text-sm hover:bg-zinc-800 rounded-md flex-1 text-center text-zinc-200">
                      {year().label}
                    </ArkDate.TableCellTrigger>
                  </ArkDate.TableCell>
                )}
              </Index>
            </ArkDate.TableRow>
          )}
        </Index>
      </ArkDate.TableBody>
    </ArkDate.Table>
  </ArkDate.View>
);
