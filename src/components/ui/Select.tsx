// src/components/ui/Select/Select.tsx
import { Select as ArkSelect, createListCollection } from '@ark-ui/solid';
import { ChevronDownIcon } from 'lucide-solid';
import { For, Show, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv } from 'tailwind-variants';

import { CommonStatus, Field, FieldInfo } from './Field';
import { fieldStyles } from './sharedStyles';
//import type { SelectRootProps } from './types';


export const selectStyles = tv({
  extend: fieldStyles,
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    control: 'relative flex items-center w-full',
    trigger: 'flex h-11 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100',
    content: 'z-50 min-w-[var(--reference-width)] overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 p-1 text-zinc-200 shadow-xl',
    item: 'flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm text-zinc-300 hover:bg-zinc-700 data-[selected]:bg-zinc-700 data-[selected]:text-white',
  },
});

export interface SelectConfig<T> {
  items: T[];
  itemToString?: (item: T) => string;
  itemToValue?: (item: T) => string;
  renderItem: (item: T) => JSX.Element;
}

export interface SelectState<T> {
  value?: string[];
  onValueChange?: (details: { value: string[]; items: T[] }) => void;
}

export interface SelectRootProps<T> {
  field: FieldInfo;
  status: CommonStatus;
  state: SelectState<T>;
  config: SelectConfig<T>;
  className?: string;
}
export const SelectRoot = <T,>(props: SelectRootProps<T>) => {
  const styles = selectStyles();
  const collection = () => createListCollection({
    items: props.config.items ?? [],
    itemToString: props.config.itemToString,
    itemToValue: props.config.itemToValue,
  });

  const renderItem = props.config.renderItem 
    ? props.config.renderItem 
    : (item: T) => props.config.itemToString?.(item) ?? String(item);

  return (
    <Field field={props.field} status={props.status} className={props.className}>
      <ArkSelect.Root
        collection={collection()}
        value={props.state.value}
        onValueChange={props.state.onValueChange}
        className={styles.root()}
      >
        <ArkSelect.Control className={styles.control()}>
          <ArkSelect.Trigger className={styles.trigger()}>
            <ArkSelect.ValueText placeholder={props.field.placeholder} />
            <ArkSelect.Indicator>
              <ChevronDownIcon size={16} />
            </ArkSelect.Indicator>
          </ArkSelect.Trigger>
        </ArkSelect.Control>

        <Portal>
          <ArkSelect.Positioner>
            <ArkSelect.Content className={styles.content()}>
              <For each={collection().items}>
                {(item) => (
    <ArkSelect.Item item={item} className={styles.item()}>
      <ArkSelect.ItemText>{renderItem(item)}</ArkSelect.ItemText>
      <ArkSelect.ItemIndicator>✓</ArkSelect.ItemIndicator>
    </ArkSelect.Item>
  )}
              </For>
            </ArkSelect.Content>
          </ArkSelect.Positioner>
        </Portal>
      </ArkSelect.Root>
    </Field>
  );
};