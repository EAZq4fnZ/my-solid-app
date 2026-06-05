// src/features/px/PxInsertForm.tsx
import type { IsoDateString } from '@/types/date';
import { createForm } from '@tanstack/solid-form';
import { PxFormFields } from './PxFormFields';
import { pxInsertSchema } from './pxSchema';

interface PxInsertFormProps {
  onInsert: (values: typeof pxInsertSchema.infer) => Promise<void>;
  onCancel?: () => void;
}

export const PxInsertForm = (props: PxInsertFormProps) => {
  const form = createForm(() => ({
    defaultValues: {
      last_name: '',
      first_name: '',
      birthday: '' as IsoDateString,
    },
    validators: {
      onChange: ({ value }) => {
        const out = pxInsertSchema(value);
        if (out instanceof Error) {
          // biome-ignore lint/suspicious/noExplicitAny: スキーマのエラー形式を逃がすための安全なany
          return (out as any).summary;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await props.onInsert(value as typeof pxInsertSchema.infer);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="p-6 bg-zinc-900 border border-zinc-800 rounded-lg shadow-md space-y-6"
    >
      <div>
        <h3 class="text-lg font-medium text-zinc-100">新規患者 カルテ登録</h3>
        <p class="text-sm text-zinc-400 mt-1">新しく来院された患者の基本情報を入力してください。</p>
      </div>

      <PxFormFields form={form} />

      <div class="flex justify-end gap-3 pt-2 border-t border-zinc-800">
        {props.onCancel && (
          <button
            type="button"
            onClick={props.onCancel}
            class="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-sm border border-zinc-800 rounded-md transition-colors"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          カルテを新規作成
        </button>
      </div>
    </form>
  );
};