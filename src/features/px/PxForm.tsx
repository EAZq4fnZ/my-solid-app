// features/px/PxForm.tsx
import { createForm } from '@tanstack/solid-form';
import { pxInsertSchema, defaultPxValues, type PxRow } from './pxSchema';
import { formatToJpEra } from '@/utils/dateUtils';
import { Show } from 'solid-js';
import { Input } from '@/components/ui/Input';

interface PxFormProps {
  initialValues?: PxRow; //[cite: 4]
  mode: 'view' | 'edit' | 'create';
  onSave: (data: any) => Promise<void>; // 保存ロジックは外からもらう
}

export const PxForm = (props: PxFormProps) => {
  const isReadOnly = () => props.mode === 'view';

  const form = createForm(() => ({
    defaultValues: props.initialValues ?? defaultPxValues,
    validators: {
      onChange: pxInsertSchema, // バリデーションに専念
    },
    onSubmit: async ({ value }) => {
      await props.onSave(value); // 送信自体は props に任せる
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* 表示と入力に専念するUI */}
      <div class="grid gap-4">
        <form.Field
          name="last_name"
          children={(field) => (
            <Input
              label="氏名（姓）"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              readOnly={isReadOnly()} // 表示モードの切り替え
              //errortext={field().state.meta.errors} // バリデーション結果の表示
            />
          )}
        />

        {/* 補助情報の表示に専念 (和暦変換など[cite: 1]) */}
        <form.Field
          name="birthday"
          children={(field) => (
            <div>
              <Input
                type="date"
                //value={field().state.value}
                readOnly={isReadOnly()}
              />
              <p class="text-sm">和暦: {formatToJpEra(field().state.value)}</p>
              [cite: 1]
            </div>
          )}
        />
      </div>

      <Show when={!isReadOnly()}>
        <button type="submit" disabled={form.state.isSubmitting}>
          {props.mode === 'create' ? '新規登録' : '更新を保存'}
        </button>
      </Show>
    </form>
  );
};
