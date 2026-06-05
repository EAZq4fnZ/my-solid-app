// src/features/px/PxUpdateForm.tsx
import type { IsoDateString } from '@/types/date';
import { createForm } from '@tanstack/solid-form';
import { PxFormFields } from './PxFormFields';
import { pxUpdateSchema } from './pxSchema';

interface PxUpdateFormProps {
  initialData: {
    last_name?: string;
    first_name?: string;
    birthday?: string;
  };
  onUpdate: (values: typeof pxUpdateSchema.infer) => Promise<void>;
  onCancel?: () => void;
}

export const PxUpdateForm = (props: PxUpdateFormProps) => {
  const form = createForm(() => ({
    defaultValues: {
      last_name: props.initialData.last_name ?? '',
      first_name: props.initialData.first_name ?? '',
      birthday: (props.initialData.birthday ?? '') as IsoDateString,
    },
    validators: {
      onChange: ({ value }) => {
        const out = pxUpdateSchema(value);
        if (out instanceof Error) {
          // biome-ignore lint/suspicious/noExplicitAny: スキーマのエラー形式を逃がすための安全なany
          return (out as any).summary;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await props.onUpdate(value as typeof pxUpdateSchema.infer);
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
        <h3 class="text-lg font-medium text-zinc-100">患者情報 編集</h3>
        <p class="text-sm text-zinc-400 mt-1">変更のあった項目を書き換えて保存してください。</p>
      </div>

      <PxFormFields form={form} />

      <div class="flex justify-end gap-3 pt-2 border-t border-zinc-800">
        {props.onCancel && (
          <button
            type="button"
            onClick={props.onCancel}
            class="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-sm border border-zinc-800 rounded-md transition-colors"
          >
            変更を破棄
          </button>
        )}
        <button
          type="submit"
          class="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          変更を保存する
        </button>
      </div>
    </form>
  );
};