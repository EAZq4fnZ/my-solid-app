// src/components/ui/Combobox/ZipCombo.tsx
import type { ComboboxInputValueChangeDetails } from '@ark-ui/solid';
import { createMemo } from 'solid-js';

import type { StAddrInfo } from '@/types/zip';
import { useZip } from '@/lib/zip/useZip';
import { ComboboxRoot, type ComboboxRootProps } from './Combobox'; // FieldInfoをインポートするため
import type { FieldInfo } from '../Field';

interface ZipComboProps {
  form: any;
  name: string;
  targetName: string;
  field: FieldInfo; 
  className?: string;
  onInputValueChange?: (details: ComboboxInputValueChangeDetails) => void;
}

export const ZipCombo = (props: ZipComboProps) => {
  const { setInputValue, suggestions, isPending } = useZip();

  const safeItems = createMemo((): StAddrInfo[] => {
    const res = suggestions();
    if (!res) return [];
    if (typeof res === 'object' && 'success' in res) {
      return res.success && Array.isArray(res.data) ? res.data : [];
    }
    return Array.isArray(res) ? res : [];
  });

  const handleSelectionChange = (details: { items: StAddrInfo[] }) => {
    const selectedItem = details.items[0];
    if (selectedItem) {
      props.form.setFieldValue(props.name, selectedItem.addrParts.zipCode);
      props.form.setFieldValue(props.targetName, selectedItem.fullAddress);
    }
  };

  return (
    <props.form.Field name={props.name}>
      {(field: any) => (
        <ComboboxRoot<StAddrInfo>
          className={props.className}
          field={{
            label: props.field.label??'郵便番号',
            placeholder: props.field.placeholder??'000-0000',
            error: field.state.meta.errors[0]?.toString(),
          }}
          status={{
            invalid: field.state.meta.errors.length > 0,
          }}
          state={{
            onValueChange: handleSelectionChange,
          }}
          config={{
    items: safeItems(),
    isPending: isPending,
    itemToString: (item) => item.addrParts.zipCode,
    itemToValue: (item) => item.addrParts.zipCode,
    renderItem: (item) => (
      <div className="flex flex-col gap-0.5 w-full">
        <span className="font-mono font-bold text-zinc-100">
          {item.addrParts.zipCode}
        </span>
        <span className="text-xs text-zinc-400">{item.fullAddress}</span>
      </div>
    ),
    // ここに移動させます
    onInputValueChange: (d: { inputValue: string }) => {
      setInputValue(d.inputValue);
      props.onInputValueChange?.(d);
    },
  }}
/>
      )}
    </props.form.Field>
  );
};