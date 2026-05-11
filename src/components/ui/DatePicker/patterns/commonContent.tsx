// src/components/ui/DatePicker/patterns/commonContent.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { Index } from 'solid-js';

import type {
  DatePickerApiObject,
  DatePickerParts,
  DatePickerViewStyles,
} from '../types';

/**
 * 標準的なカレンダー（コンテンツ部）のレンダリングエンジン
 * parts.renderRangeText を受け取ることで、表示ロジックを外部から注入（オーバーライド）可能にします。
 */
export const renderCommonContent = (
  api: DatePickerApiObject,
  styles: DatePickerViewStyles,
  parts: Pick<DatePickerParts, 'renderRangeText'>,
) => {
  return (
    <>
      {/* --- Day View (日表示) --- */}
      <ArkDate.View view="day">
        <ArkDate.ViewControl class={styles.viewControl()}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>

          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {/* DI された表示関数を実行 */}
            {parts.renderRangeText(api)}
          </ArkDate.ViewTrigger>

          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table()}>
          <ArkDate.TableHead>
            <ArkDate.TableRow class="flex">
              <Index each={api.weekDays}>
                {(day) => (
                  <ArkDate.TableHeader class={styles.tableHeader()}>
                    {day().short}
                  </ArkDate.TableHeader>
                )}
              </Index>
            </ArkDate.TableRow>
          </ArkDate.TableHead>
          <ArkDate.TableBody>
            <Index each={api.weeks}>
              {(week) => (
                <ArkDate.TableRow class="flex">
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

      {/* --- Month View (月表示) --- */}
      <ArkDate.View view="month">
        <ArkDate.ViewControl class={styles.viewControl()}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>
          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {parts.renderRangeText(api)}
          </ArkDate.ViewTrigger>
          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table()}>
          <ArkDate.TableBody>
            <Index each={api.getMonthsGrid({ columns: 4, format: 'short' })}>
              {(months) => (
                <ArkDate.TableRow class="flex">
                  <Index each={months()}>
                    {(month) => (
                      <ArkDate.TableCell value={month().value}>
                        <ArkDate.TableCellTrigger class="p-2 text-sm hover:bg-zinc-800 rounded-md flex-1 text-center text-zinc-200 data-selected:bg-zinc-100 data-selected:text-zinc-950 transition-colors">
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

      {/* --- Year View (年表示) --- */}
      <ArkDate.View view="year">
        <ArkDate.ViewControl class={styles.viewControl()}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>
          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {parts.renderRangeText(api)}
          </ArkDate.ViewTrigger>
          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table()}>
          <ArkDate.TableBody>
            <Index each={api.getYearsGrid({ columns: 4 })}>
              {(years) => (
                <ArkDate.TableRow class="flex">
                  <Index each={years()}>
                    {(year) => (
                      <ArkDate.TableCell value={year().value}>
                        <ArkDate.TableCellTrigger class="p-2 text-sm hover:bg-zinc-800 rounded-md flex-1 text-center text-zinc-200 data-selected:bg-zinc-100 data-selected:text-zinc-950 transition-colors">
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
    </>
  );
};
