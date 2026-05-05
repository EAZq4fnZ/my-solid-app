// components/ui/Combobox.tsx
import { Combobox as ArkCombo, createListCollection } from '@ark-ui/solid';
import { createMemo, Index, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { fieldStyles } from './sharedStyles';

// 1. スタイル定義: fieldStyles を継承しつつ Combobox 用のパーツを追加
export const comboboxStyles = tv({
  extend: fieldStyles,
  slots: {
    content: [
      'z-50 min-w-[12rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-1 text-zinc-200 shadow-xl',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    ],
    item: [
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors',
      'hover:bg-zinc-800 data-[highlighted]:bg-zinc-800 data-[selected]:bg-zinc-800 data-[selected]:text-white',
    ],
    trigger:
      'absolute right-2 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors',
    control: 'relative w-full',
  },
});

type ComboboxVariants = VariantProps<typeof comboboxStyles>;
interface ComboboxProps
  extends Omit<ArkCombo.RootProps<any>, 'collection'>,
    ComboboxVariants {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export const Combobox = (props: ComboboxProps) => {
  // 2. props を分離 (Button と同様の手法)[cite: 4]
  const [variantProps, localProps] = splitProps(props, [
    'label',
    'error',
    'placeholder',
    'options',
  ]);
  const styles = comboboxStyles();

  // 3. Ark UI v3 の仕様: items ではなく collection を作成
  const collection = createMemo(() =>
    createListCollection({ items: variantProps.options ?? [] }),
  );

  return (
    <ArkCombo.Root
      {...localProps}
      collection={collection()}
      positioning={{ gutter: 4 }}
    >
      {/* 4. sharedStyles 由来の label[cite: 1] */}
      <Show when={variantProps.label}>
        <ArkCombo.Label class={styles.label()}>
          {variantProps.label}
        </ArkCombo.Label>
      </Show>

      <ArkCombo.Control class={styles.control()}>
        {/* 5. sharedStyles 由来の input。エラー時は data-invalid を付与[cite: 1] */}
        <ArkCombo.Input
          class={styles.input()}
          placeholder={variantProps.placeholder}
          data-invalid={variantProps.error ? '' : undefined}
        />
        <ArkCombo.Trigger class={styles.trigger()}>
          <span class="text-[10px]">▼</span>
        </ArkCombo.Trigger>
      </ArkCombo.Control>

      <Portal>
        <ArkCombo.Positioner>
          <ArkCombo.Content class={styles.content()}>
            <Index each={collection().items}>
              {(item) => (
                <ArkCombo.Item item={item()} class={styles.item()}>
                  <ArkCombo.ItemText>{item().label}</ArkCombo.ItemText>
                  <ArkCombo.ItemIndicator>✓</ArkCombo.ItemIndicator>
                </ArkCombo.Item>
              )}
            </Index>
          </ArkCombo.Content>
        </ArkCombo.Positioner>
      </Portal>

      {/* 6. sharedStyles 由来の errorText[cite: 1] */}
      <Show when={variantProps.error}>
        <p class={styles.errorText()}>{variantProps.error}</p>
      </Show>
    </ArkCombo.Root>
  );
};
