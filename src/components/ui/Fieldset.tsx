// components/ui/Field.tsx
import { Fieldset as ArkFieldset } from '@ark-ui/solid';
import { type JSX, Show, splitProps } from 'solid-js';

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
  status: CommonStatus;
  children: JSX.Element;
  className?: string;
}
export const FieldSet = (props: FieldSetProps) => {

  const styles = fieldStyles(); // sharedStyles を継承

  return (
    <ArkFieldset.Root
      invalid={props.status.invalid}
      className={styles.root({ class: props.className })}
    >
      <Show when={props.fieldSet.label}>
        <div className="flex justify-between items-center mb-1">
          <ArkFieldset.Legend className={styles.label()}>
            {props.fieldSet.label}
          </ArkFieldset.Legend>
        </div>
      </Show>

      <Show when={props.fieldSet.helperText}>
      <ArkFieldset.HelperText className={styles.helperText()}>
        {props.fieldSet.helperText}
      </ArkFieldset.HelperText>
      </Show>

      {/* 複数の Field コンポーネントがここに入ります。
          スペースを空けるためのラッパー div を配置 
      */}
      <div className="flex flex-col gap-4">{props.children}</div>

      <Show when={props.fieldSet.error}>
      <ArkFieldset.ErrorText className={styles.errorText()}>
        {props.fieldSet.error}
      </ArkFieldset.ErrorText>
      </Show>
    </ArkFieldset.Root>
  );
};
