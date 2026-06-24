// src/components/ui/Combobox/ZipCombo.tsx
import { useZip } from '@/lib/zip/useZip';
import type { StAddrInfo } from '@/types/zip';

import { ComboboxRoot } from './Combobox';
import type { CommonStatus, FieldInfo } from '../Field';

interface ZipComboProps {
  field: FieldInfo;
  status: CommonStatus;
  onSelect: (item: StAddrInfo) => void; // ここでマッパーを接続
  className?: string;
}

export const ZipCombo = (props: ZipComboProps) => {
  const { setInputValue, suggestions, isPending } = useZip();

  return (
    <ComboboxRoot<StAddrInfo>
      field={props.field}
      status={props.status}
      state={{
        onValueChange: (d) => d.items[0] && props.onSelect(d.items[0]),
      }}
      config={{
        items: suggestions()?.data ?? [],
        isPending: isPending,
        itemToString: (i) => i.addrParts.zipCode,
        renderItem: (i) => (
          <div>
            <span>{i.addrParts.zipCode}</span>
            <span>{i.fullAddress}</span>
          </div>
        ),
        onInputValueChange: (d) => setInputValue(d.inputValue),
      }}
    />
  );
};
