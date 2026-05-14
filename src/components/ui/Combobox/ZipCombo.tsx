// src/components/ui/Combobox/ZipCombo.tsx
import type { ComboboxInputValueChangeDetails } from '@ark-ui/solid';
//import { Combobox as ArkCombo } from '@ark-ui/solid';
import { splitProps } from 'solid-js';

import type { StAddrInfo } from '@/lib/zip/types';
import { useZip } from '@/lib/zip/useZip';
import { ComboboxRoot } from './Combobox';

interface ZipComboProps {
  // biome-ignore lint/suspicious/noExplicitAny: Form の複雑な型推論を維持するため any を許容
  form: any; // tanstack/form のインスタンス
  name: string; // 郵便番号
  targetName: string; // 住所を格納するフィールド名
  label: string; // フォームラベル
  placeholder?: string; // 入力ヒント
}

/**
 * 郵便番号検索機能付きコンボボックス
 */
export const ZipCombo = (props: ZipComboProps) => {
  const [local, rest] = splitProps(props, [
    'form',
    'name',
    'targetName',
    'label',
    'placeholder',
  ]);

  const { setInputValue, suggestions, isPending } = useZip();

  /**
   * ZipResult 型から安全に StAddrInfo[] を取り出す
   */
  const getSafeItems = (): StAddrInfo[] => {
    const res = suggestions();
    if (!res) return [];
    // suggestions() が ZipResult { success: boolean; data: T[] } の場合を考慮
    /*if ('data' in res && Array.isArray(res.data)) {
      return res.data;
    }*/
    // yubinbango-data.ts が返す ZipResult 型への対応
    if (typeof res === 'object' && 'success' in res) {
      return res.success && Array.isArray(res.data) ? res.data : [];
    }
    // すでに配列として返ってきている場合
    return Array.isArray(res) ? res : [];
  };

  // アイテム選択時のハンドリング
  const handleSelectionChange = (details: { items: StAddrInfo[] }) => {
    const selectedItem = details.items[0];
    if (selectedItem) {
      local.form.setFieldValue(local.name, selectedItem.addrParts.zipCode);
      local.form.setFieldValue(local.targetName, selectedItem.fullAddress);
    }
  };

  return (
    <local.form.Field name={local.name}>
      {/* biome-ignore lint/suspicious/noExplicitAny: TanStack Form Internal logic */}
      {(field: any) => (
        <ComboboxRoot<StAddrInfo>
          {...rest}
          label={local.label}
          placeholder={local.placeholder ?? '000-0000'}
          error={field.state.meta.errors[0]?.toString()}
          // 安全に取り出した配列を渡す
          items={getSafeItems()}
          /**
           * TS2349 対策:
           * SolidJS の resource.loading は関数ではないため () を付けずに参照します。
           */
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
