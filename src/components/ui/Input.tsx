// components/ui/Input.tsx
import { type JSX, Show, splitProps } from 'solid-js';
import { tv, type VariantProps } from 'tailwind-variants';

import { fieldStyles } from './sharedStyles';

// 1. スタイル定義: fieldStyles を継承
export const inputStyles = tv({
  extend: fieldStyles,
  slots: {
    // Input 特有の追加スタイルがあればここに記述（現在は継承のみで十分です）
    root: 'flex flex-col w-full',
  },
});

type InputVariants = VariantProps<typeof inputStyles>;

// 2. Props の定義
// 通常の input 要素の属性（placeholder, type, value等）とバリアントを統合
interface InputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
  label?: string;
  error?: string;
}

export const Input = (props: InputProps) => {
  // 3. props を分解: スタイル用(variantProps) と input要素用(localProps)
  const [variantProps, localProps] = splitProps(props, [
    'label',
    'error',
    'class',
  ]);
  const styles = inputStyles();

  return (
    <div class={styles.root()}>
      {/* 4. ラベルの表示 (sharedStyles のスタイルを適用)[cite: 1] */}
      <Show when={variantProps.label}>
        <label class={styles.label()} for={localProps.id}>
          {variantProps.label}
        </label>
      </Show>

      {/* 5. Input 本体の表示[cite: 1] */}
      <input
        {...localProps}
        // data-invalid 属性を付与することで sharedStyles のエラー用スタイルが発動[cite: 1]
        data-invalid={variantProps.error ? '' : undefined}
        class={styles.input({ class: variantProps.class })}
      />

      {/* 6. エラーメッセージの表示[cite: 1] */}
      <Show when={variantProps.error}>
        <p class={styles.errorText()}>{variantProps.error}</p>
      </Show>
    </div>
  );
};
