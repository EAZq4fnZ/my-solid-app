// src/components/ui/DatePicker/index.tsx
import { Dynamic } from 'solid-js/web';
import { splitProps } from 'solid-js';

import { DefaultDatePicker } from './DefaultDatePicker';
import type { DatePickerProps } from './types';

export type { DatePickerProps } from './types';

export const uiRegistry = {
//  japanese: JpEraDatePicker,
  iso8601: DefaultDatePicker,
} as const;

interface RegistryDatePickerProps extends DatePickerProps {
  pickerId?: keyof typeof uiRegistry;
}

export const DatePicker = (props: RegistryDatePickerProps) => {
  const [local, restProps] = splitProps(props, ['pickerId']);
  const Component = () => uiRegistry[local.pickerId ?? 'iso8601'];
  return ;
};
