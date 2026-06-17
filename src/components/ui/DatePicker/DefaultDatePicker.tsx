// src/components/ui/DatePicker/DefaultDatePicker.tsx
import { CalendarIcon } from 'lucide-solid';
import { Portal } from 'solid-js/web';

import { DateInput as ArkDateInput } from '@ark-ui/solid/date-input';
import { DatePicker as ArkDatePicker } from '@ark-ui/solid/date-picker';
import { LocaleProvider } from '@ark-ui/solid/locale';

import { Field } from '../Field';
import type { DatePickerProps } from './types';

export const DefaultDatePicker = (props: DatePickerProps) => {
  return (
    <Field
      field={props.field}
      status={props.status}
      className={props.className}
    >
      <LocaleProvider locale={props.config.locale}>
        <ArkDatePicker.RootProvider>
          <ArkDateInput.Root
            //value={props.state.value}
            onValueChange={(d) => props.state.onValueChange(d.value)}
            disabled={props.status.disabled}
            readOnly={props.status.readOnly}
            locale={props.config.locale}
            selectionMode={props.status.selectionMode ?? 'single'}
            granularity={props.status.granularity ?? 'day'}
            timeZone={props.config.timeZone}
          >
            <ArkDateInput.Control>
              <ArkDateInput.Input placeholder={props.config.inputPlaceholder} />
              <ArkDateInput.Trigger>
                <CalendarIcon />
              </ArkDateInput.Trigger>
            </ArkDateInput.Control>
          </ArkDateInput.Root>

          <Portal>
            <ArkDatePicker.Positioner>
              <ArkDatePicker.Content>
                {/* カレンダー表示の実装 */}
              </ArkDatePicker.Content>
            </ArkDatePicker.Positioner>
          </Portal>
        </ArkDatePicker.RootProvider>
      </LocaleProvider>
    </Field>
  );
};
