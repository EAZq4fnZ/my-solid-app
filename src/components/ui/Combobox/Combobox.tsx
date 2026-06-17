// src/components/ui/Combobox/Combobox.tsx
import { Combobox as ArkCombo, createListCollection } from '@ark-ui/solid';
import { ChevronDownIcon, XIcon } from 'lucide-solid';
import { For, Show, createMemo, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv } from 'tailwind-variants';

import { Field, type FieldInfo, type CommonStatus } from '../Field';
import { fieldStyles } from '../sharedStyles';

// Combobox特有の設定型を定義（昨日合意した構造）
export interface ComboboxConfig<T> {
  items: T[];
  isPending?: boolean | (() => boolean);
  renderItem: (item: T) => JSX.Element;
  itemToString?: (item: T) => string;
  itemToValue?: (item: T) => string;
  onInputValueChange?: (details: { inputValue: string }) => void;
}

// 状態管理用（仮）
export interface ComboboxState<T> {
  value?: string[];
  onValueChange?: (details: { value: string[]; items: T[] }) => void;
}

// 構造化されたProps
export interface ComboboxRootProps<T> {
  field: FieldInfo;
  status: CommonStatus;
  state: ComboboxState<T>;
  config: ComboboxConfig<T>;
  className?: string;
}

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

export const ComboboxRoot = <T,>(props: ComboboxRootProps<T>) => {
  const collection = createMemo(() =>
    createListCollection({
      items: props.config.items ?? [],
      itemToString: props.config.itemToString,
      itemToValue: props.config.itemToValue,
    }),
  );

  const styles = comboboxStyles({
    disabled: props.status.disabled ? ('true' as 'true') : undefined,
    invalid: props.status.invalid ? ('true' as 'true') : undefined,
  });

  return (
    // 分解せず、構造化したオブジェクトをそのまま Field へ渡す
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
        disabled={props.status.disabled}
        invalid={props.status.invalid}
        class={styles.root()}
      >
        <ArkCombo.Control class={styles.control()}>
          <ArkCombo.Input
            placeholder={props.field.placeholder}
            class={styles.input()}
          />
          <Show when={props.state.value && props.state.value.length > 0}>
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
              <Show when={props.config.isPending}>
                <div class={styles.loading()}>検索中...</div>
              </Show>

              <ArkCombo.ItemGroup>
                <For each={collection().items}>
                  {(item) => (
                    <ArkCombo.Item item={item} class={styles.item()}>
                      <ArkCombo.ItemText>
                        {props.config.renderItem(item)}
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
