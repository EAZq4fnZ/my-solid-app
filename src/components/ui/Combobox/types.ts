// src/components/ui/Combobox/types.ts
import type { Combobox } from '@ark-ui/solid';
import type { JSX } from 'solid-js';

export type ComboboxApiObject<T> = ReturnType<
  Parameters<Parameters<typeof Combobox.Context<T>>[0]['children']>[0]
>;

export type ComboboxViewStyles = Record<string, () => string>;

export interface ComboboxParts<T> {
  renderItem: (item: T) => JSX.Element;
  itemToString: (item: T) => string;
  itemToValue: (item: T) => string;
}
