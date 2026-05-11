// src/components/ui/DatePicker/types.ts
import type { DatePicker } from '@ark-ui/solid';
import type { JSX } from 'solid-js';

/**
 * Ark UI の Context から API オブジェクトの型を抽出
 */
export type DatePickerApiObject = ReturnType<
  Parameters<Parameters<typeof DatePicker.Context>[0]['children']>[0]
>;

/**
 * スタイルオブジェクトの型定義（any を完全に排除）
 */
export type DatePickerViewStyles = Record<string, () => string>;

/**
 * 外部から注入するパーツのインターフェース
 */
export interface DatePickerParts {
  /** 入力・制御パーツのレンダリング */
  renderControl: (
    api: DatePickerApiObject,
    styles: DatePickerViewStyles,
    options: { placeholder?: string },
  ) => JSX.Element;

  /** カレンダー・コンテンツパーツのレンダリング */
  renderContent: (
    api: DatePickerApiObject,
    styles: DatePickerViewStyles,
  ) => JSX.Element;

  /** * カレンダーヘッダー（2026年5月など）の表示ロジックを注入
   * Java でいう抽象メソッドの定義に相当します
   */
  renderRangeText: (api: DatePickerApiObject) => JSX.Element;
}
