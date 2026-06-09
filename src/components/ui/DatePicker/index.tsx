// src/components/ui/DatePicker/index.tsx
import { Dynamic } from 'solid-js/web';
import { splitProps } from 'solid-js';
import { EraDatePicker } from './EraDatePicker';
import type { BaseDatePickerProps } from './types';

export type { BaseDatePickerProps } from './types';

// UIのバリエーション名簿（レジストリ）
const uiRegistry = {
  'japanese-era': EraDatePicker,
  // 将来的に標準西暦ピッカーを作ったらここに並べる
  // 'standard': DefaultDatePicker,
} as const;

interface RegistryDatePickerProps extends BaseDatePickerProps {
  pickerId?: keyof typeof uiRegistry;
}

/**
 * 🌟 外部のフォーム画面は、このコンポーネントだけをインポートして使う
 */
export const DatePicker = (props: RegistryDatePickerProps) => {
  const [local, restProps] = splitProps(props, ['pickerId']);

  // 指定がない場合は、主役の和暦ピッカーをデフォルトにして動作させる
  const Component = () => uiRegistry[local.pickerId ?? 'japanese-era'];

  return <Dynamic component={Component()} {...restProps} />;
};