// src/components/ui/DatePicker/types.ts
import type { DateInput, DatePicker } from '@ark-ui/solid';
import type { JSX } from 'solid-js';

/**
 * Ark UI の Context からそれぞれの API オブジェクトの型を正確に抽出
 */
export type DatePickerApiObject = ReturnType<
  Parameters<Parameters<typeof DatePicker.Context>[0]['children']>[0]
>;

export type DateInputApiObject = ReturnType<
  Parameters<Parameters<typeof DateInput.Context>[0]['children']>[0]
>;

/**
 * スタイルオブジェクトの型定義
 */
export type DatePickerViewStyles = Record<string, () => string>;

/**
 * 外部から注入するパーツ（パターンレイアウト）のインターフェース
 */
export interface DatePickerParts {
  /** 手入力・制御（DateInput周り）のレンダリング */
  renderControl: (
    dateInputApi: DateInputApiObject,
    datePickerApi: DatePickerApiObject,
    styles: DatePickerViewStyles,
    options: { placeholder?: string; editable?: boolean },
  ) => JSX.Element;

  /** カレンダー・ポップアップ（DatePicker周り）のレンダリング */
  renderContent: (
    datePickerApi: DatePickerApiObject,
    styles: DatePickerViewStyles,
  ) => JSX.Element;

  /** カレンダーヘッダー（day, month, yearビュー毎）の動的表示ロジック */
  renderRangeText: (api: DatePickerApiObject) => JSX.Element;
}
