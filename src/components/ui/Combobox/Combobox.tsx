// src/components/ui/Combobox/Combobox.tsx
import { Combobox as ArkCombo, createListCollection } from '@ark-ui/solid';
import { ChevronDownIcon, XIcon } from 'lucide-solid';
import { For, Show, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv } from 'tailwind-variants';

import { Field } from '../Field';
import { fieldStyles } from '../sharedStyles';
import type { ComboboxParts } from './types';

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
    content:
      'bg-zinc-800 border border-zinc-700 rounded-md p-1 flex flex-col gap-1 max-h-64 overflow-y-auto min-w-[var(--reference-width)] shadow-xl',
    item: 'flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 data-[selected]:bg-zinc-700 data-[selected]:text-zinc-100 transition-colors',
    loading: 'px-3 py-2 text-sm text-zinc-500 animate-pulse',
  },
});

export interface ComboboxRootProps<T> extends ComboboxParts<T> {
  items: T[];
  label: string;
  error?: string;
  isPending?: boolean;
  placeholder?: string;
  value?: string[];
  onValueChange?: (details: { value: string[]; items: T[] }) => void;
  onInputValueChange?: (details: { inputValue: string }) => void;
  disabled?: boolean;
  invalid?: boolean;
}

export const ComboboxRoot = <T,>(props: ComboboxRootProps<T>) => {
  const [local, variantProps, restProps] = splitProps(
    props,
    [
      'items',
      'label',
      'error',
      'isPending',
      'renderItem',
      'itemToString',
      'itemToValue',
      'placeholder',
    ],
    ['disabled', 'invalid'],
  );

  const collection = createMemo(() =>
    createListCollection({
      items: local.items ?? [],
      itemToString: local.itemToString,
      itemToValue: local.itemToValue,
    }),
  );

  /**
   * Tailwind Variants を使用してスタイルを定義します。
   * 拡張元 (fieldStyles) が期待している型が string | number であるため、
   * 条件を満たす場合はリテラル文字列 'true' を型安全にアサーション (as 'true') して渡します。
   */
  const styles = comboboxStyles({
    disabled: variantProps.disabled ? ('true' as 'true') : undefined,
    invalid: variantProps.invalid ? ('true' as 'true') : undefined,
  });

  return (
    <Field label={local.label} error={local.error}>
      <ArkCombo.Root
        // biome-ignore lint/suspicious/noExplicitAny: SolidJS と Ark UI 間のシグナル結合による内部型ミスマッチを回避するため any へキャスト
        {...(restProps as any)}
        collection={collection()}
        disabled={variantProps.disabled}
        invalid={variantProps.invalid}
        class={styles.root()}
      >
        <ArkCombo.Control class={styles.control()}>
          <ArkCombo.Input
            placeholder={local.placeholder}
            class={styles.input()}
          />
          <Show when={props.value && props.value.length > 0}>
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
