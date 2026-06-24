// src/components/ui/Combobox/Combobox.tsx
import { Combobox as ArkCombo, createListCollection } from '@ark-ui/solid';
import { ChevronDownIcon, XIcon } from 'lucide-solid';
import { For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv } from 'tailwind-variants';

import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';
import type { ComboboxRootProps } from './types';

// スタイル定義は既存のものを利用
export const comboboxStyles = tv({
  extend: fieldStyles,
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    control: 'relative flex items-center w-full',
    input:
      'flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100',
    trigger:
      'absolute right-3 text-zinc-500 hover:text-zinc-100 cursor-pointer z-10',
    clearTrigger:
      'absolute right-10 text-zinc-500 hover:text-zinc-400 cursor-pointer z-10',
    positioner: 'z-50',
    content:
      'bg-zinc-800 border border-zinc-700 rounded-md p-1 flex flex-col gap-1 max-h-64 overflow-y-auto min-w-[var(--reference-width)] shadow-xl',
    item: 'flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 data-[selected]:bg-zinc-700 data-[selected]:text-zinc-100 transition-colors',
    loading: 'px-3 py-2 text-sm text-zinc-500 animate-pulse',
  },
});

export const ComboboxRoot = <T,>(props: ComboboxRootProps<T>) => {
  const styles = comboboxStyles();
  const collection = () =>
    createListCollection({
      items: props.config.items ?? [],
      itemToString: props.config.itemToString,
      itemToValue: props.config.itemToValue,
    });

  return (
    <Field
      field={props.field}
      status={props.status}
      className={props.className}
    >
      <ArkCombo.Root
        collection={collection()}
        value={props.state.value}
        onValueChange={props.state.onValueChange}
        onInputValueChange={props.config.onInputValueChange}
        class={styles.root()}
      >
        <ArkCombo.Control class={styles.control()}>
          <ArkCombo.Input
            placeholder={props.field.placeholder}
            class={styles.input()}
          />
          <Show when={props.state.value && props.state.value.length > 0}>
            <ArkCombo.ClearTrigger>
              <XIcon size={14} />
            </ArkCombo.ClearTrigger>
          </Show>
          <ArkCombo.Trigger>
            <ChevronDownIcon size={16} />
          </ArkCombo.Trigger>
        </ArkCombo.Control>
        <Portal>
          <ArkCombo.Positioner>
            <ArkCombo.Content>
              <Show when={props.config.isPending}>
                <div>検索中...</div>
              </Show>
              <For each={collection().items}>
                {(item) => (
                  <ArkCombo.Item item={item}>
                    {props.config.renderItem(item)}
                  </ArkCombo.Item>
                )}
              </For>
            </ArkCombo.Content>
          </ArkCombo.Positioner>
        </Portal>
      </ArkCombo.Root>
    </Field>
  );
};
