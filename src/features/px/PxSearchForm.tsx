// src/features/px/PxSearchForm.tsx
import type { IsoDateString } from '@/types/date';
import { createForm } from '@tanstack/solid-form';
import { PxFormFields } from './PxFormFields';
import { pxSearchSchema } from './pxSchema';

interface PxSearchFormProps {
  onSearch: (values: typeof pxSearchSchema.infer) => void;
}

export const PxSearchForm = (props: PxSearchFormProps) => {
  const form = createForm(() => ({
    defaultValues: {
      last_name: '',
      first_name: '',
      // ブランド型（__brand）と一致させるため、空文字を確実にアサーションします
      birthday: '' as IsoDateString,
    },
    onSubmit: async ({ value }) => {
      const result = pxSearchSchema(value);
      if (!(result instanceof Error)) {
        props.onSearch(value);
      }
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
        <h3 class="text-lg font-medium text-zinc-100">患者情報 検索</h3>
        <p class="text-sm text-zinc-400 mt-1">
          条件を入力して患者を検索します。
        </p>
      </div>

      <PxFormFields form={form} />

      <div class="flex justify-end pt-2">
        <button
          type="submit"
          class="px-5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          この条件で検索
        </button>
      </div>
    </form>
  );
};
