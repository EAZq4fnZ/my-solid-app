import { DatePicker } from '@ark-ui/solid';
import { CalendarIcon } from 'lucide-solid';
import { For, createMemo } from 'solid-js';

export const BasicDateInput = () => {
  return (
    <div class="p-8 bg-zinc-950 min-h-screen text-white">
      <DatePicker.Root locale="ja-JP" selectionMode="single">
        <DatePicker.Context>
          {(api) => {
            // ラベルに表示する和暦を計算
            const japaneseEra = createMemo(() => {
              const date = api().value[0];
              if (!date) return '(未選択)';
              const year = date.year;
              const reiwaYear = year - 2018;
              return year >= 2019
                ? `(令和${reiwaYear === 1 ? '元' : reiwaYear}年)`
                : `(${year}年)`;
            });

            return (
              <>
                <DatePicker.Label class="block text-sm font-medium mb-1">
                  日付選択{' '}
                  <span class="text-blue-400 font-bold">{japaneseEra()}</span>
                </DatePicker.Label>

                <DatePicker.Control class="flex items-center gap-2 border border-zinc-800 rounded-md bg-zinc-900 px-3 py-2 w-fit focus-within:ring-2 focus-within:ring-blue-500">
                  <DatePicker.Input
                    placeholder="yyyy/mm/dd"
                    class="bg-transparent outline-none text-zinc-100 w-32 tabular-nums"
                  />

                  <DatePicker.Trigger class="text-zinc-500 hover:text-zinc-300 transition-colors">
                    <CalendarIcon size={18} />
                  </DatePicker.Trigger>
                </DatePicker.Control>

                {/* ポップアップ（カレンダー）部分 */}
                <DatePicker.Positioner>
                  <DatePicker.Content class="bg-zinc-900 border border-zinc-800 p-4 rounded-md shadow-2xl z-50">
                    <DatePicker.View view="day">
                      <DatePicker.ViewControl class="flex justify-between items-center mb-4 text-sm">
                        <DatePicker.PrevTrigger class="p-1 hover:bg-zinc-800 rounded">
                          前月
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger class="font-bold">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger class="p-1 hover:bg-zinc-800 rounded">
                          次月
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>

                      <DatePicker.Table class="w-full text-center">
                        <DatePicker.TableBody>
                          <For each={api().weeks}>
                            {(week) => (
                              <DatePicker.TableRow>
                                <For each={week}>
                                  {(day) => (
                                    <DatePicker.TableCell value={day}>
                                      <DatePicker.TableCellTrigger class="p-2 w-9 h-9 hover:bg-zinc-700 rounded-md aria-selected:bg-blue-600 transition-all text-sm">
                                        {day.day}
                                      </DatePicker.TableCellTrigger>
                                    </DatePicker.TableCell>
                                  )}
                                </For>
                              </DatePicker.TableRow>
                            )}
                          </For>
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </DatePicker.View>
                  </DatePicker.Content>
                </DatePicker.Positioner>
              </>
            );
          }}
        </DatePicker.Context>
      </DatePicker.Root>
    </div>
  );
};
