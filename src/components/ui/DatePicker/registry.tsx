// src/components/ui/DatePicker/index.tsx
import { Dynamic } from 'solid-js/web';
import { splitProps } from 'solid-js';
import { JpEraDatePicker } from './JpEraDatePicker';
import { DefaultDatePicker } from './DefaultDatePicker';
import type { BaseDatePickerProps } from './types';

export type { BaseDatePickerProps } from './types';

const uiRegistry = {
  japanese: JpEraDatePicker,
  iso8601: DefaultDatePicker,
} as const;

interface RegistryDatePickerProps extends BaseDatePickerProps {
  pickerId?: keyof typeof uiRegistry;
}

export const DatePicker = (props: RegistryDatePickerProps) => {
  const [local, restProps] = splitProps(props, ['pickerId']);
  const Component = () => uiRegistry[local.pickerId ?? 'iso8601'];

  return <Dynamic component={Component()} {...restProps} />;
};
