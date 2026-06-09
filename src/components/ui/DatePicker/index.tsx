// src/components/ui/DatePicker/index.tsx
import { Dynamic } from 'solid-js/web';
import { splitProps } from 'solid-js';
import { JpEraDatePicker } from './JpEraDatePicker';
import type { BaseDatePickerProps } from './types';

export type { BaseDatePickerProps } from './types';

// UIのバリエーション名簿（レジストリ）
const uiRegistry = {
  japanese: JpEraDatePicker,
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
  const Component = () => uiRegistry[local.pickerId ?? 'japanese'];

  return <Dynamic component={Component()} {...restProps} />;
};
