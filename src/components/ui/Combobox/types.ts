// src/components/ui/Combobox/types.ts
import type { Combobox } from '@ark-ui/solid';
import type { JSX } from 'solid-js';

/**
 * Ark UI の Context から API オブジェクトの型を抽出
 */
export type ComboboxApiObject<T> = ReturnType<
  Parameters<Parameters<typeof Combobox.Context<T>>[0]['children']>[0]
>;

/**
 * スタイルオブジェクトの型定義
 */
export type ComboboxViewStyles = Record<string, () => string>;

/**
 * 外部から注入するパーツのインターフェース
 */
export interface ComboboxParts<T> {
  /** アイテム一個一個のレンダリング */
  renderItem: (item: T) => JSX.Element;
  /** アイテムを文字列に変換（検索用） */
  itemToString: (item: T) => string;
  /** アイテムを値に変換（選択用） */
  itemToValue: (item: T) => string;
}
