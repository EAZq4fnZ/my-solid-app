// src/components/ui/DatePicker/DatePicker.tsx
import {
  DateInput as ArkDateInput,
  DatePicker as ArkDatePicker,
  useDateInput,
  useDatePicker,
} from '@ark-ui/solid';
import { type DateValue, parseDate } from '@internationalized/date';

import { splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';

import type {
  DateInputApiObject,
  DatePickerApiObject,
  DatePickerParts,
  DatePickerViewStyles,
} from './type';

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
    inputGroup:
      'relative flex items-center w-full border border-zinc-800 rounded-md bg-zinc-950 px-3 py-2 focus-within:border-zinc-400 transition-colors',
    inputField:
      'flex items-center gap-1 text-sm text-zinc-100 w-full outline-none',
    segment:
      'px-0.5 rounded hover:bg-zinc-800 focus:bg-zinc-100 focus:text-zinc-950 outline-none data-[placeholder]:text-zinc-500',
    inputIcon:
      'text-zinc-500 hover:text-zinc-100 cursor-pointer ml-2 z-10 flex items-center',
  },
});

type DatePickerVariants = VariantProps<typeof datePickerStyles>;

interface DatePickerProps
  extends Omit<
      ArkDatePicker.RootProps,
      'value' | 'format' | 'parse' | 'onValueChange'
    >,
    DatePickerVariants {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  editable?: boolean;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  format?: (value: DateValue) => string;
  parse?: (text: string) => DateValue | undefined;
  parts: DatePickerParts;
}

export const DatePicker = (props: DatePickerProps) => {
  const [local, rootProps] = splitProps(props, [
    'label',
    'helperText',
    'error',
    'placeholder',
    'editable',
    'parts',
    'value',
    'onValueChange',
    'format',
    'parse',
  ]);

  const styles = datePickerStyles() as unknown as DatePickerViewStyles;

  const currentSelection = () => (local.value ? [parseDate(local.value)] : []);

  const handleSelectionChange = (values: DateValue[]) => {
    const firstDate = values[0];
    if (!firstDate) {
      local.onValueChange?.(null);
      return;
    }
    const isoString = `${firstDate.year}-${String(firstDate.month).padStart(2, '0')}-${String(firstDate.day).padStart(2, '0')}`;
    local.onValueChange?.(isoString);
  };

  const datePicker = useDatePicker(() => ({
    ...rootProps,
    value: currentSelection(),
    onValueChange: (details) => handleSelectionChange(details.value),
    positioning: { gutter: 4 },
  }));

  const dateInput = useDateInput(() => ({
    value: currentSelection(),
    onValueChange: (details) => handleSelectionChange(details.value),
    readOnly: local.editable === false,
  }));

  return (
    <Field
      label={local.label}
      helperText={local.helperText}
      error={local.error}
    >
      <ArkDateInput.RootProvider value={dateInput}>
        <ArkDatePicker.RootProvider value={datePicker}>
          {/* 🌟 1. まず Input のコンテキストを展開 */}
          <ArkDateInput.Context>
            {(inputApi) => (
              /* 🌟 2. 次に Picker のコンテキストを綺麗にネストさせて展開 */
              <ArkDatePicker.Context>
                {(pickerApi) => {
                  const currentInputApi = inputApi() as DateInputApiObject;
                  const currentPickerApi = pickerApi() as DatePickerApiObject;

                  return (
                    <div class="w-full">
                      {local.parts.renderControl(
                        currentInputApi,
                        currentPickerApi,
                        styles,
                        {
                          placeholder: local.placeholder,
                          editable: local.editable,
                        },
                      )}

                      <Portal>
                        <ArkDatePicker.Positioner>
                          <ArkDatePicker.Content class={styles.content()}>
                            {local.parts.renderContent(
                              currentPickerApi,
                              styles,
                            )}
                          </ArkDatePicker.Content>
                        </ArkDatePicker.Positioner>
                      </Portal>
                    </div>
                  );
                }}
              </ArkDatePicker.Context>
            )}
          </ArkDateInput.Context>
        </ArkDatePicker.RootProvider>
      </ArkDateInput.RootProvider>
    </Field>
  );
};
