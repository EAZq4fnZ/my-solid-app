// components/ui/Select.tsx
import { Select as ArkSelect, createListCollection } from '@ark-ui/solid';
import { createMemo, Index, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { tv, type VariantProps } from 'tailwind-variants';

import { fieldStyles } from './sharedStyles';

// --- Select コンポーネント独自の定義 ---
export const selectStyles = tv({
  extend: fieldStyles, // 共通の label, input(trigger用), errorText を継承
  slots: {
    content: [
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-1 text-zinc-200 shadow-xl',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    ],
    item: [
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors',
      'hover:bg-zinc-800 focus:bg-zinc-800 data-[selected]:bg-zinc-800 data-[selected]:text-white data-[highlighted]:bg-zinc-800',
    ],
    control: 'relative w-full',
    trigger: 'flex items-center justify-between', // fieldStyles.input に追加するスタイル[cite: 1]
  },
});

type SelectVariants = VariantProps<typeof selectStyles>;
interface SelectProps
  extends Omit<ArkSelect.RootProps<any>, 'collection'>,
    SelectVariants {
  label?: string;
  placeholder?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = (props: SelectProps) => {
  const [variantProps, localProps] = splitProps(props, [
    'label',
    'placeholder',
    'error',
    'options',
  ]);
  const styles = selectStyles();
  // Ark UI v3 仕様: collection の作成
  const collection = createMemo(() =>
    createListCollection({ items: variantProps.options ?? [] }),
  );

  return (
    <ArkSelect.Root
      {...localProps}
      collection={collection()}
      positioning={{ gutter: 4 }}
    >
      {/* 1. ラベル (sharedStyles 継承) */}[cite: 1]
      <Show when={variantProps.label}>
        <ArkSelect.Label class={styles.label()}>
          {variantProps.label}
        </ArkSelect.Label>
      </Show>
      <ArkSelect.Control class={styles.control()}>
        {/* 2. トリガー (sharedStyles の input スタイルを適用) */}[cite: 1]
        <ArkSelect.Trigger
          class={styles.input({ class: styles.trigger() })}
          data-invalid={variantProps.error ? '' : undefined}
        >
          <ArkSelect.ValueText
            placeholder={variantProps.placeholder ?? '選択してください'}
          />
          <ArkSelect.Indicator class="text-zinc-500 text-[10px]">
            ▼
          </ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content class={styles.content()}>
            <Index each={collection().items}>
              {(item) => (
                <ArkSelect.Item item={item()} class={styles.item()}>
                  <ArkSelect.ItemText>{item().label}</ArkSelect.ItemText>
                  <ArkSelect.ItemIndicator>✓</ArkSelect.ItemIndicator>
                </ArkSelect.Item>
              )}
            </Index>
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      {/* 3. エラーメッセージ (sharedStyles 継承) */}[cite: 1]
      <Show when={variantProps.error}>
        <p class={styles.errorText()}>{variantProps.error}</p>
      </Show>
    </ArkSelect.Root>
  );
};
