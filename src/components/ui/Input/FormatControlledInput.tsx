// src/components/ui/Input/FormatControlledInput.tsx
import { createSignal, splitProps } from 'solid-js';

import { Input } from './Input';
interface FormatControlledInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: <formからの値を受け取るためany型を使用>
  form: any;
  name: string;
  label?: string;
  error?: string;
  /** 内部値(Value)を画面表示用(Display)に変換する関数 */
  format: (value: string) => string;
  /** 画面の入力(Display)を内部値(Value)に逆変換する関数 */
  parse: (text: string) => string;
}

export const FormatControlledInput = (props: FormatControlledInputProps) => {
  const [local, rest] = splitProps(props, ['form', 'name', 'format', 'parse']);
  const [isFocused, setIsFocused] = createSignal(false);

  // TanStack Form などのフィールドコンテキスト（親から流れてくる想定）
  // フォームが持っている「本当の値（例: 2026-06-03）」
  const actualValue = () => local.form.getFieldValue(local.name) ?? '';

  /**
   * 画面上に表示する値を制御する
   * @returns 画面上に表示する値 (例: 令和8(2026)/06/03)
   */
  const displayValue = () => {
    // フォーカス中：生の値／フォーカス外：表示用の値を出す（例: 2026-06-03／令和8(2026)/06/03）
    return isFocused() ? actualValue() : local.format(actualValue());
  };

  return (
    <Input
      {...rest}
      value={displayValue()}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // フォーカスが外れた時 入力された文字を parse してFormの正規の値を更新
        setIsFocused(false);
        const parsedValue = local.parse(e.currentTarget.value);
        local.form.setFieldValue(local.name, parsedValue);
      }}
    />
  );
};
