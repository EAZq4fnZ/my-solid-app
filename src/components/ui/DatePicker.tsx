// components/ui/DatePicker.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid';
import { Index, type JSX, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { fieldStyles } from './sharedStyles';

export const datePickerStyles = tv({
  extend: fieldStyles,
  slots: {
    content: [
      'z-50 bg-zinc-950 border border-zinc-800 rounded-md p-4 shadow-2xl outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    ],
    viewControl: 'flex items-center justify-between mb-4',
    table: 'w-full border-collapse',
    tableHeader: 'text-zinc-500 font-medium text-xs w-8 h-8',
    tableBody: '',
    day: [
      'w-8 h-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors hover:bg-zinc-800',
      'data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 data-[today]:text-zinc-400 data-[today]:font-bold',
      'data-[outside-range]:opacity-20 data-[disabled]:cursor-not-allowed',
    ],
    control: 'relative w-full',
    prevTrigger:
      'p-1 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-20',
    nextTrigger:
      'p-1 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-20',
    viewTrigger:
      'px-2 py-1 hover:bg-zinc-800 rounded-md transition-colors text-sm font-bold',
  },
});

type DatePickerVariants = VariantProps<typeof datePickerStyles>;

// useContext ではなく Context コンポーネントの型引数から API 型を取得
// Ark UI の Api は Accessor にラップされた状態で Context から渡されます
type DatePickerApi = Parameters<
  Parameters<typeof ArkDate.Context>[0]['children']
>[0];

export interface DatePickerProps extends ArkDate.RootProps, DatePickerVariants {
  label?: string;
  error?: string;
  placeholder?: string;
  renderContent?: (api: DatePickerApi) => JSX.Element;
}

export const DatePicker = (props: DatePickerProps) => {
  const [variantProps, localProps] = splitProps(props, [
    'label',
    'error',
    'placeholder',
    'renderContent',
  ]);
  const styles = datePickerStyles();

  return (
    <ArkDate.Root {...localProps} positioning={{ gutter: 4 }}>
      <Show when={variantProps.label}>
        <ArkDate.Label class={styles.label()}>
          {variantProps.label}
        </ArkDate.Label>
      </Show>

      <ArkDate.Control class={styles.control()}>
        <ArkDate.Input
          class={styles.input()}
          placeholder={variantProps.placeholder ?? 'YYYY/MM/DD'}
          data-invalid={variantProps.error ? '' : undefined}
        />
        <ArkDate.Trigger class="absolute right-2 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors">
          <CalendarIcon />
        </ArkDate.Trigger>
      </ArkDate.Control>

      <Portal>
        <ArkDate.Positioner>
          <ArkDate.Content class={styles.content()}>
            <ArkDate.Context>
              {(api) => {
                return variantProps.renderContent ? (
                  variantProps.renderContent(api)
                ) : (
                  <DefaultCalendarView api={api} styles={styles} />
                );
              }}
            </ArkDate.Context>
          </ArkDate.Content>
        </ArkDate.Positioner>
      </Portal>

      <Show when={variantProps.error}>
        <p class={styles.errorText()}>{variantProps.error}</p>
      </Show>
    </ArkDate.Root>
  );
};

interface DefaultCalendarViewProps {
  api: DatePickerApi;
  // biome-ignore lint/suspicious/noExplicitAny: styles の型は tailwind-variants 生成物につき許容
  styles: any;
}

const DefaultCalendarView = (props: DefaultCalendarViewProps) => {
  return (
    <ArkDate.View view="day">
      <ArkDate.ViewControl class={props.styles.viewControl()}>
        <ArkDate.PrevTrigger class={props.styles.prevTrigger()}>
          <ChevronLeftIcon />
        </ArkDate.PrevTrigger>
        <ArkDate.ViewTrigger class={props.styles.viewTrigger()}>
          <ArkDate.RangeText />
        </ArkDate.ViewTrigger>
        <ArkDate.NextTrigger class={props.styles.nextTrigger()}>
          <ChevronRightIcon />
        </ArkDate.NextTrigger>
      </ArkDate.ViewControl>

      <ArkDate.Table class={props.styles.table()}>
        <ArkDate.TableHead>
          <ArkDate.TableRow>
            <Index each={props.api().weekDays}>
              {(weekDay) => (
                <ArkDate.TableHeader class={props.styles.tableHeader()}>
                  {weekDay().short}
                </ArkDate.TableHeader>
              )}
            </Index>
          </ArkDate.TableRow>
        </ArkDate.TableHead>
        <ArkDate.TableBody>
          <Index each={props.api().weeks}>
            {(week) => (
              <ArkDate.TableRow>
                <Index each={week()}>
                  {(day) => (
                    <ArkDate.TableCell value={day()}>
                      <ArkDate.TableCellTrigger class={props.styles.day()}>
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
  );
};
