// components/ui/Field.tsx
import { Field as ArkField } from '@ark-ui/solid';
import { type JSX, Show, splitProps } from 'solid-js';
import { fieldStyles } from './sharedStyles';

/** コンポーネントの状態 */
export interface CommonStatus {
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

/** UI表示項目 */
export interface FieldInfo {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
}

/** FieldProps */
export interface FieldProps {
  field: FieldInfo;
  status: CommonStatus;
  children: JSX.Element;
  className?: string;
}

export const Field = (props: FieldProps) => {
  const styles = fieldStyles();

  return (
    <ArkField.Root
      // 状態を明示的に Ark UI へ注入
      invalid={props.status.invalid}
      disabled={props.status.disabled}
      readOnly={props.status.readOnly}
      required={props.status.required}
      className={styles.root({ class: props.className })}
    >
      <Show when={props.field.label}>
        <div className="flex justify-between items-center">
          <ArkField.Label className={styles.label()}>{props.field.label}</ArkField.Label>
        </div>
      </Show>

      <Show when={props.field.helperText}>
        <ArkField.HelperText className={styles.helperText()}>
          {props.field.helperText}
        </ArkField.HelperText>
      </Show>

      {/* 入力コンポーネント本体 (Combobox等) */}
      {props.children}

      <Show when={props.field.error}>
        <ArkField.ErrorText className={styles.errorText()}>
          {props.field.error}
        </ArkField.ErrorText>
      </Show>
    </ArkField.Root>
  );
};