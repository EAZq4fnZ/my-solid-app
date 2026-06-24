// components/ui/Field.tsx
import { Fieldset as ArkFieldset } from '@ark-ui/solid';
import { type JSX, Show } from 'solid-js';

import { fieldStyles } from './sharedStyles';

/** コンポーネントの状態 */
export interface CommonStatus {
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  required?: boolean;
}
// interface FieldSetProps
export interface FieldSetInfo {
  label?: string;
  helperText?: string;
  error?: string;
}

export interface FieldSetProps {
  fieldSet: FieldSetInfo;
  status?: CommonStatus;
  children: JSX.Element;
  className?: string;
}
export const FieldSet = (props: FieldSetProps) => {
  const styles = fieldStyles(); // sharedStyles を継承

  return (
    <ArkFieldset.Root
      invalid={props.status?.invalid ?? false}
      class={styles.root({ class: props.className })}
    >
      <Show when={props.fieldSet.label}>
        <div class="flex justify-between items-center mb-1">
          <ArkFieldset.Legend class={styles.label()}>
            {props.fieldSet.label}
          </ArkFieldset.Legend>
        </div>
      </Show>

      <Show when={props.fieldSet.helperText}>
        <ArkFieldset.HelperText class={styles.helperText()}>
          {props.fieldSet.helperText}
        </ArkFieldset.HelperText>
      </Show>

      {/* 子要素（各 Field） */}
      {props.children}

      <Show when={props.fieldSet.error}>
        <ArkFieldset.ErrorText class={styles.errorText()}>
          {props.fieldSet.error}
        </ArkFieldset.ErrorText>
      </Show>
    </ArkFieldset.Root>
  );
};
