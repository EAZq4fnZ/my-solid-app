// components/ui/Field.tsx
import { Fieldset as ArkFieldset } from '@ark-ui/solid';
import { type JSX, Show, splitProps } from 'solid-js';

import { fieldStyles } from './sharedStyles';

// interface FieldSetProps
export interface FieldSetProps extends ArkFieldset.RootProps {
  label?: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
  children: JSX.Element;
}

/**
 * @description
 * Ark UI の FieldSet.Root を使用した基底コンポーネント。
 * コンポーネント内のすべての要素（Label, Input, ErrorText）に対し、
 * 自動的にアクセシビリティ属性（id, for, aria-describedby等）を紐付けます。
 * @param props FieldSetProps
 * @returns JSX.Element(Ark UI の FieldSet.Root を使用したコンポーネント。Ark UI の他コンポーネントをこれでラップさせる)
 */
export const FieldSet = (props: FieldSetProps) => {
  const [local, rootProps] = splitProps(props, [
    'label',
    'error',
    'helperText',
    'optional',
    'children',
  ]);
  const styles = fieldStyles(); // sharedStyles を継承

  return (
    <ArkFieldset.Root
      invalid={!!local.error} //error がある場合はinvalidにする
      {...rootProps}
      class="flex flex-col gap-4 w-full border-none p-0 m-0"
    >
      <Show when={local.label}>
        <div class="flex justify-between items-center mb-1">
          <ArkFieldset.Legend class={styles.label()}>
            {local.label}
          </ArkFieldset.Legend>
          <Show when={local.optional}>
            <span class={styles.oprional()}>任意</span>
          </Show>
        </div>
      </Show>
      {/*<Show when={local.description}>*/}
      <ArkFieldset.HelperText class={styles.helperText()}>
        {local.helperText}
      </ArkFieldset.HelperText>
      {/*</Show>*/}

      {/* 複数の Field コンポーネントがここに入ります。
          スペースを空けるためのラッパー div を配置 
      */}
      <div class="flex flex-col gap-4">{local.children}</div>

      {/*<Show when={local.error}>*/}
      <ArkFieldset.ErrorText class={styles.errorText()}>
        {local.error}
      </ArkFieldset.ErrorText>
      {/*</Show>*/}
    </ArkFieldset.Root>
  );
};
