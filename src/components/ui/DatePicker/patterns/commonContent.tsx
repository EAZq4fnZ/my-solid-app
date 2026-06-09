// src/components/ui/DatePicker/patterns/commonContent.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { Index } from 'solid-js';

// styles 引数の型を、実際の types.ts にある datePickerStyles に完全一致させます
type DatePickerViewStyles = {
  viewControl?: () => string;
  table?: () => string;
  //bioeme-ignore lint/suspicious/noExplicitAny: コールバック引数の any を許容
} & Record<string, any>;

/**
 * 標準的なカレンダー（コンテンツ部）のレンダリングエンジン
 * parts.renderRangeText を受け取ることで、表示ロジックを外部から注入（オーバーライド）可能にします。
 */
export const renderCommonContent = (
  //biome-ignore lint/suspicious/noExplicitAny: コールバック引数の any を許容
  api: any,
  styles: DatePickerViewStyles,
  //biome-ignore lint/suspicious/noExplicitAny: コールバック引数の Element を許容
  parts: { renderRangeText: (api: any) => any },
) => {
  // 上位層から api がシグナルとして渡ってきた場合と、展開済みのオブジェクトとして渡ってきた場合の双方に対応する防衛ロジック
  const datePicker = typeof api === 'function' ? api() : api;

  return (
    <>
      {/* --- Day View (日表示) --- */}
      <ArkDate.View view="day">
        <ArkDate.ViewControl class={styles.viewControl?.() ?? ''}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>

          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {/* DI された表示関数を実行 */}
            {parts.renderRangeText(datePicker)}
          </ArkDate.ViewTrigger>

          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table?.() ?? ''}>
          <ArkDate.TableHead>
            <ArkDate.TableRow class="flex w-full justify-around border-b border-zinc-800 pb-1 mb-1">
              <Index each={datePicker.weekDays}>
                {(day) => (
                  <ArkDate.TableHeader class="text-xs text-zinc-500 font-medium w-8 text-center select-none">
                    {day().short}
                  </ArkDate.TableHeader>
                )}
              </Index>
            </ArkDate.TableRow>
          </ArkDate.TableHead>

          <ArkDate.TableBody>
            <Index each={datePicker.weeks}>
              {(week) => (
                <ArkDate.TableRow class="flex w-full justify-around mt-1">
                  <Index each={week()}>
                    {(day) => (
                      <ArkDate.TableCell value={day().value}>
                        <ArkDate.TableCellTrigger class="w-8 h-8 text-sm hover:bg-zinc-800 rounded-md flex items-center justify-center text-zinc-200 data-selected:bg-zinc-100 data-selected:text-zinc-950 data-outside-range:text-zinc-600 data-today:border data-today:border-zinc-600 font-mono transition-colors">
                          {day().label}
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

      {/* --- Month View (月選択表示) --- */}
      <ArkDate.View view="month">
        <ArkDate.ViewControl class={styles.viewControl?.() ?? ''}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>
          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {parts.renderRangeText(datePicker)}
          </ArkDate.ViewTrigger>
          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table?.() ?? ''}>
          <ArkDate.TableBody>
            <Index each={datePicker.getMonthsGrid({ columns: 3 })}>
              {(months) => (
                <ArkDate.TableRow class="flex w-full justify-around mt-2">
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

      {/* --- Year View (年選択表示) --- */}
      <ArkDate.View view="year">
        <ArkDate.ViewControl class={styles.viewControl?.() ?? ''}>
          <ArkDate.PrevTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronLeftIcon size={18} />
          </ArkDate.PrevTrigger>
          <ArkDate.ViewTrigger class="hover:bg-zinc-800 px-2 py-1 rounded-md font-medium transition-colors">
            {parts.renderRangeText(datePicker)}
          </ArkDate.ViewTrigger>
          <ArkDate.NextTrigger class="hover:bg-zinc-800 p-1 rounded transition-colors">
            <ChevronRightIcon size={18} />
          </ArkDate.NextTrigger>
        </ArkDate.ViewControl>

        <ArkDate.Table class={styles.table?.() ?? ''}>
          <ArkDate.TableBody>
            <Index each={datePicker.getYearsGrid({ columns: 4 })}>
              {(years) => (
                <ArkDate.TableRow class="flex w-full justify-around">
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
