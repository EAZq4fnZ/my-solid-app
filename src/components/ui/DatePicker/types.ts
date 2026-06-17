// src/components/ui/DatePicker/types.ts
import type { DateValue } from '@ark-ui/solid/date-picker';

import type { FieldInfo, CommonStatus } from '../Field';

export interface DatePickerStatus extends CommonStatus {
  granularity?: 'day' | 'minute';
  selectionMode?: 'single' | 'multiple';
}

// 表示・振る舞いに関する設定オブジェクト
export interface DatePickerConfig {
  calendarId: string;
  locale: string;
  timeZone: string;
  inputPlaceholder?: string;
}

// 状態管理用
export interface DatePickerState {
  value: DateValue[];
  onValueChange: (value: DateValue[]) => void;
}

// 統合されたProps定義
export interface DatePickerProps {
  field: FieldInfo;
  status: DatePickerStatus;
  config: DatePickerConfig;
  state: DatePickerState;
  className?: string;
}
