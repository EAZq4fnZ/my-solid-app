// src/components/ui/Combobox/ZipCombo.tsx
import type { ComboboxInputValueChangeDetails } from '@ark-ui/solid';
import { splitProps } from 'solid-js';

import type { StAddrInfo } from '@/types/zip';
import { useZip } from '@/lib/zip/useZip';
import { ComboboxRoot } from './Combobox';

interface ZipComboProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Form の型推論維持のため
  form: any;
  name: string;
  targetName: string;
  label: string;
  placeholder?: string;
}

export const ZipCombo = (props: ZipComboProps) => {
  const [local, rest] = splitProps(props, [
    'form',
    'name',
    'targetName',
    'label',
    'placeholder',
  ]);

  const { setInputValue, suggestions, isPending } = useZip();

  const getSafeItems = (): StAddrInfo[] => {
    const res = suggestions();
    if (!res) return [];
    if (typeof res === 'object' && 'success' in res) {
      return res.success && Array.isArray(res.data) ? res.data : [];
    }
    return Array.isArray(res) ? res : [];
  };

  const handleSelectionChange = (details: { items: StAddrInfo[] }) => {
    const selectedItem = details.items[0];
    if (selectedItem) {
      local.form.setFieldValue(local.name, selectedItem.addrParts.zipCode);
      local.form.setFieldValue(local.targetName, selectedItem.fullAddress);
    }
  };

  return (
    <local.form.Field name={local.name}>
      {/* biome-ignore lint/suspicious/noExplicitAny: Form internal context key */}
      {(field: any) => (
        <ComboboxRoot<StAddrInfo>
          {...rest}
          label={local.label}
          placeholder={local.placeholder ?? '000-0000'}
          error={field.state.meta.errors[0]?.toString()}
          items={getSafeItems()}
          isPending={isPending}
          onInputValueChange={(d: ComboboxInputValueChangeDetails) =>
            setInputValue(d.inputValue)
          }
          onValueChange={handleSelectionChange}
          itemToString={(item) => item.addrParts.zipCode}
          itemToValue={(item) => item.addrParts.zipCode}
          renderItem={(item) => (
            <div class="flex flex-col gap-0.5 w-full">
              <span class="font-mono font-bold text-zinc-100">
                {item.addrParts.zipCode}
              </span>
              <span class="text-xs text-zinc-400 truncate">
                {item.fullAddress}
              </span>
            </div>
          )}
        />
      )}
    </local.form.Field>
  );
};
