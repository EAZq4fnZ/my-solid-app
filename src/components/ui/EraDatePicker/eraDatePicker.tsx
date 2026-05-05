// src/components/ui/EraDatePicker/eraDatePicker.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { Index } from 'solid-js';

import { getJpEraYear } from '@/utils/dateUtils';

import { Button } from '../Button';
import {
  DatePicker,
  type DatePickerProps,
  datePickerStyles,
} from '../DatePicker';
import { Select } from '../Select';
import { generateMonthOptions, generateYearOptions } from './inner-utils';

/**
 * Ark UI の Context から api (Accessor) の中身の型を抽出
 */
type DatePickerApi = Parameters<
  Parameters<typeof ArkDate.Context>[0]['children']
>[0];

/*
 * EraDatePicker
 * 日付選択用のカスタムDatePicker
 */
export const EraDatePicker = (props: DatePickerProps) => {
  const styles = datePickerStyles();

  const renderEraContent = (api: DatePickerApi) => {
    return (
      <div class="flex flex-col gap-4">
        <ArkDate.View view="day">
          <div class={styles.viewControl()}>
            <ArkDate.PrevTrigger class={styles.prevTrigger()}>
              <ChevronLeftIcon size={16} />
            </ArkDate.PrevTrigger>

            <div class="flex gap-1">
              <EraYearSelect api={api} />
              <EraMonthSelect api={api} />
            </div>

            <ArkDate.NextTrigger class={styles.nextTrigger()}>
              <ChevronRightIcon size={16} />
            </ArkDate.NextTrigger>
          </div>

          <ArkDate.Table class={styles.table()}>
            <ArkDate.TableHead>
              <ArkDate.TableRow>
                <Index each={api().weekDays}>
                  {(weekDay) => (
                    <ArkDate.TableHeader class={styles.tableHeader()}>
                      {weekDay().short}
                    </ArkDate.TableHeader>
                  )}
                </Index>
              </ArkDate.TableRow>
            </ArkDate.TableHead>
            <ArkDate.TableBody>
              <Index each={api().weeks}>
                {(week) => (
                  <ArkDate.TableRow>
                    <Index each={week()}>
                      {(day) => (
                        <ArkDate.TableCell value={day()}>
                          <ArkDate.TableCellTrigger class={styles.day()}>
                            {day().day}
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

        <div class="border-t border-zinc-800 pt-2 flex justify-center">
          <Button
            visual="outline"
            class="w-full"
            size="sm"
            onClick={() => {
              // 今日を選択する → 現在フォーカスされている日付 → カレンダーの開始日
              const baseDate = api().focusedValue || api().visibleRange.start;
              api().setValue([baseDate]);
              api().setFocusedValue(baseDate);
            }}
          >
            今日を選択
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DatePicker
      {...props}
      max={props.max}
      min={props.min}
      placeholder="yyyy/mm/dd"
      locale={props.locale ?? 'ja-JP-u-ca-japanese'}
      format={(date) => {
        if (!date) return '';
        const y = date.year;
        const m = String(date.month).padStart(2, '0');
        const d = String(date.day).padStart(2, '0');
        const era = getJpEraYear(date.year, date.month, date.day);

        return `${y}(${era})/${m}/${d}`;
      }}
      renderContent={renderEraContent}
    />
  );
};

/**
 * 年選択用のカスタムSelect
 */
const EraYearSelect = (props: { api: DatePickerApi }) => {
  const options = generateYearOptions();
  return (
    <Select
      options={options}
      value={[String(props.api().visibleRange.start.year)]}
      onValueChange={(details) => {
        const val = details.value[0];
        if (val) {
          // 修正点: focusedValue をイミュータブルに更新
          const newDate = props.api().focusedValue.set({ year: Number(val) });
          props.api().setFocusedValue(newDate);
        }
      }}
    />
  );
};

/**
 * 月選択用のカスタムSelect
 */
const EraMonthSelect = (props: { api: DatePickerApi }) => {
  const options = generateMonthOptions();
  return (
    <Select
      options={options}
      value={[String(props.api().visibleRange.start.month)]}
      onValueChange={(details) => {
        const val = details.value[0];
        if (val) {
          // 修正点: focusedValue をイミュータブルに更新
          const newDate = props.api().focusedValue.set({ month: Number(val) });
          props.api().setFocusedValue(newDate);
        }
      }}
    />
  );
};

export default EraDatePicker;
