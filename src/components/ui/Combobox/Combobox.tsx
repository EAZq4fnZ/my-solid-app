// src/components/ui/Combobox/Combobox.tsx
import { Combobox as ArkCombo, createListCollection } from '@ark-ui/solid';
import { ChevronDownIcon, XIcon } from 'lucide-solid';
import { For, Show, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';
import type { ComboboxParts, ComboboxViewStyles } from './types';

export const comboboxStyles = tv({
  extend: fieldStyles,
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    control: 'relative flex items-center w-full',
    input: [
      'flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100',
      'focus:ring-2 focus:ring-zinc-500 outline-none transition-all placeholder:text-zinc-500',
    ],
    trigger:
      'absolute right-3 text-zinc-500 hover:text-zinc-100 cursor-pointer z-10',
    clearTrigger:
      'absolute right-10 text-zinc-500 hover:text-zinc-400 cursor-pointer z-10',
    positioner: 'z-50',
    content: [
      'bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl outline-none overflow-hidden max-h-60 overflow-y-auto min-w-[var(--reference-width)]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    ],
    item: 'px-3 py-2 cursor-pointer text-sm text-zinc-100 data-[highlighted]:bg-zinc-800 data-[selected]:bg-zinc-700 transition-colors',
    loading: 'p-4 text-center text-xs text-zinc-500 animate-pulse',
  },
});

type ComboboxVariantProps = VariantProps<typeof comboboxStyles>;

export interface ComboboxRootProps<T>
  extends Omit<ArkCombo.RootProps<T>, 'collection'>,
    ComboboxParts<T>,
    ComboboxVariantProps {
  label?: string;
  error?: string;
  placeholder?: string;
  isPending?: boolean;
  items: T[];
}

export const ComboboxRoot = <T,>(props: ComboboxRootProps<T>) => {
  const [local, variantProps, rootProps] = splitProps(
    props as ComboboxRootProps<T>,
    [
      'label',
      'error',
      'placeholder',
      'isPending',
      'renderItem',
      'itemToString',
      'itemToValue',
      'items',
    ],
    ['disabled'],
  );

  const styles = comboboxStyles(variantProps) as unknown as ComboboxViewStyles;

  const collection = createMemo(() =>
    createListCollection({
      items: local.items ?? [],
      itemToString: local.itemToString,
      itemToValue: local.itemToValue,
    }),
  );

  return (
    <Field label={local.label} error={local.error}>
      <ArkCombo.Root
        {...rootProps}
        collection={collection()}
        class={styles.root()}
      >
        <ArkCombo.Control class={styles.control()}>
          <ArkCombo.Input
            placeholder={local.placeholder}
            class={styles.input()}
          />
          {/* value は rootProps に含まれる型として安全にアクセス可能 */}
          <Show when={rootProps.value && rootProps.value.length > 0}>
            <ArkCombo.ClearTrigger class={styles.clearTrigger()}>
              <XIcon size={14} />
            </ArkCombo.ClearTrigger>
          </Show>
          <ArkCombo.Trigger class={styles.trigger()}>
            <ChevronDownIcon size={16} />
          </ArkCombo.Trigger>
        </ArkCombo.Control>

        <Portal>
          <ArkCombo.Positioner class={styles.positioner()}>
            <ArkCombo.Content class={styles.content()}>
              <Show when={local.isPending}>
                <div class={styles.loading()}>検索中...</div>
              </Show>

              <ArkCombo.ItemGroup>
                <For each={collection().items}>
                  {(item) => (
                    <ArkCombo.Item item={item} class={styles.item()}>
                      <ArkCombo.ItemText>
                        {local.renderItem(item)}
                      </ArkCombo.ItemText>
                    </ArkCombo.Item>
                  )}
                </For>
              </ArkCombo.ItemGroup>
            </ArkCombo.Content>
          </ArkCombo.Positioner>
        </Portal>
      </ArkCombo.Root>
    </Field>
  );
};
