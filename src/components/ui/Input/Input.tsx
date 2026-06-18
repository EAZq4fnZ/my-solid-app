// components/ui/Input.tsx
import { type JSX, Show, splitProps } from 'solid-js';
import { tv, type VariantProps } from 'tailwind-variants';

import { fieldStyles } from '../sharedStyles';

// スタイル定義
export const inputStyles = tv({
  extend: fieldStyles,
  slots: {
    root: 'flex flex-col w-full',
  },
});

type InputVariants = VariantProps<typeof inputStyles>;

// Props定義
interface InputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
  label?: string;
  error?: string;
}

export const Input = (props: InputProps) => {
  const [variantProps, localProps] = splitProps(props, [
    'label',
    'error',
    'className',
  ]);
  
  const styles = inputStyles();

  return (
    <div className={styles.root({ className: variantProps.className })}>
      {/* ラベル */}
      <Show when={variantProps.label}>
        <label className={styles.label()} for={localProps.id}>
          {variantProps.label}
        </label>
      </Show>

      {/* Input 本体 */}
      <input
        {...localProps}
        className={styles.input()}
        aria-invalid={!!variantProps.error}
        aria-describedby={variantProps.error ? `${localProps.id}-error` : undefined}
      />

      {/* エラーメッセージ */}
      <Show when={variantProps.error}>
        <span className={styles.errorText()} id={`${localProps.id}-error`}>
          {variantProps.error}
        </span>
      </Show>
    </div>
  );
};