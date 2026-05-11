// src/components/ui/DatePicker/DatePicker.tsx
import { DatePicker as ArkDate } from '@ark-ui/solid';
import { parseDate } from '@internationalized/date';
import { splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';
// DatePickerViewStyles を追加でインポート
import type {
  DatePickerApiObject,
  DatePickerParts,
  DatePickerViewStyles,
} from './types';

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
      'data-[weekend=sun]:text-red-400',
      'data-[weekend=sat]:text-blue-400',
      'data-[disabled]:text-zinc-700 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent data-[disabled]:opacity-50',
    ],
    inputGroup: 'relative flex items-center w-full',
    inputIcon:
      'absolute right-3 text-zinc-500 hover:text-zinc-100 cursor-pointer z-10',
  },
});

type DatePickerVariantProps = VariantProps<typeof datePickerStyles>;

export interface DatePickerRootProps
  extends Omit<ArkDate.RootProps, 'value' | 'onValueChange'>,
    DatePickerVariantProps,
    DatePickerParts {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}

/**
 * 共通基底コンポーネント
 */
export const DatePickerRoot = (props: DatePickerRootProps) => {
  const [local, rootProps] = splitProps(props, [
    'label',
    'helperText',
    'error',
    'placeholder',
    'renderControl',
    'renderContent',
    'value',
    'onValueChange',
  ]);

  // styles を DatePickerViewStyles としてキャストして型安全にする
  const styles = datePickerStyles() as unknown as DatePickerViewStyles;

  return (
    <Field
      label={local.label}
      helperText={local.helperText}
      error={local.error}
    >
      <ArkDate.Root
        {...rootProps}
        value={local.value ? [parseDate(local.value)] : []}
        onValueChange={(details) =>
          local.onValueChange?.(details.valueAsString[0])
        }
        format={(d) =>
          `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
        }
        positioning={{ gutter: 4 }}
      >
        <ArkDate.Context>
          {(api) => {
            const currentApi = api() as DatePickerApiObject;
            return (
              <div class="w-full">
                {local.renderControl(currentApi, styles, {
                  placeholder: local.placeholder,
                })}

                <Portal>
                  <ArkDate.Positioner>
                    <ArkDate.Content class={styles.content()}>
                      {local.renderContent(currentApi, styles)}
                    </ArkDate.Content>
                  </ArkDate.Positioner>
                </Portal>
              </div>
            );
          }}
        </ArkDate.Context>
      </ArkDate.Root>
    </Field>
  );
};
