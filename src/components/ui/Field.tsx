// components/ui/Field.tsx
import { Field as ArkField } from '@ark-ui/solid';
import { type JSX, Show, splitProps } from 'solid-js';

import { fieldStyles } from './sharedStyles';

export interface FieldProps extends ArkField.RootProps {
  label?: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
  children: JSX.Element;
}

/**
 * Ark UI の Field.Root を使用した基底コンポーネント。
 * コンポーネント内のすべての要素（Label, Input, ErrorText）に対し、
 * 自動的にアクセシビリティ属性（id, for, aria-describedby等）を紐付けます。
 */
export const Field = (props: FieldProps) => {
  const [local, rootProps] = splitProps(props, [
    'label',
    'helperText',
    'error',
    'optional',
    'children',
  ]);
  const styles = fieldStyles(); // sharedStyles を継承

  return (
    <ArkField.Root
      invalid={!!local.error} // errorがある場合はinvalidにする
      {...rootProps}
      class="flex flex-col gap-1.5 w-full"
    >
      <Show when={local.label}>
        <div class="flex justify-between items-center">
          <ArkField.Label class={styles.label()}>{local.label}</ArkField.Label>
          <Show when={local.optional}>
            <span class={styles.oprional()}>任意</span>
          </Show>
        </div>
      </Show>

      {/*<Show when={local.description}>*/}
      <ArkField.HelperText class={styles.helperText()}>
        {local.helperText}
      </ArkField.HelperText>
      {/*</Show>*/}

      {/* children (Input や EraDatePicker) が入る。
         Ark UI の Field.Root のコンテキスト下にあるため、
         内部の input 要素は自動的に ID や invalid 状態を継承します。
      */}
      {local.children}

      {/*<Show when={local.error}>*/}
      <ArkField.ErrorText class={styles.errorText()}>
        {local.error}
      </ArkField.ErrorText>
      {/*</Show>*/}
    </ArkField.Root>
  );
};
