// src/components/ui/Combobox/types.ts
import type { JSX } from 'solid-js';

import type { CommonStatus, FieldInfo } from '../Field';

// コンポーネント共通の設定型
export interface ComboboxConfig<T> {
  items: T[];
  isPending?: boolean | (() => boolean);
  renderItem: (item: T) => JSX.Element;
  itemToString?: (item: T) => string;
  itemToValue?: (item: T) => string;
  onInputValueChange?: (details: { inputValue: string }) => void;
}

// コンポーネント共通の状態型
export interface ComboboxState<T> {
  value?: string[];
  onValueChange?: (details: { value: string[]; items: T[] }) => void;
}

// 構造化されたProps (すべてのCombobox系コンポーネントがこれを継承)
export interface ComboboxRootProps<T> {
  field: FieldInfo;
  status: CommonStatus;
  state: ComboboxState<T>;
  config: ComboboxConfig<T>;
  className?: string;
}
