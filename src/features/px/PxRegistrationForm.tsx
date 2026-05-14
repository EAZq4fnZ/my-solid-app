// src/features/px/components/PxRegistrationForm.tsx
import { createForm } from '@tanstack/solid-form';
import { For } from 'solid-js';

import { Field } from '@/components/ui/Field';
import { EraDatePicker } from '@/components/ui/DatePicker/EraDatePicker';
import { Button } from '@/components/ui/Button'; 
import { GENDER_CODES } from '@/constants/gender';
import { 
  pxInsertValidators, 
  defaultPxValues 
} from '../schemas/pxSchema';

export const PxRegistrationForm = () => {
  const form = createForm(() => ({
    defaultValues: defaultPxValues,
    // pxSchema.ts で定義された ArkType バリデーターを適用
    validators: pxInsertValidators,
    onSubmit: async ({ value }) => {
      // 送信データは FieldSet で包んでもフラットな PxInsert 型のままです
      console.log('登録データ:', value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="max-w-2xl mx-auto p-8 bg-zinc-900 border border-zinc-800 rounded-xl space-y-8"
    >
      <header>
        <h2 class="text-2xl font-bold text-zinc-100">Px 新規登録</h2>
        <p class="text-zinc-400 text-sm mt-1">
          登録する方の基本情報と連絡先を入力してください。
        </p>
      </header>

      {/* 氏名グループ */}
      <Field.FieldSet class="space-y-3">
        <Field.Legend class="text-sm font-semibold text-zinc-400">お名前</Field.Legend>
        <div class="grid grid-cols-2 gap-4">
          <form.Field name="last_name">
            {(field) => (
              <Field 
                label="姓" 
                labelClass="sr-only" 
                error={field().state.meta.errors[0]?.toString()}
              >
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  placeholder="姓"
                  class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="first_name">
            {(field) => (
              <Field 
                label="名" 
                labelClass="sr-only" 
                error={field().state.meta.errors[0]?.toString()}
              >
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  placeholder="名"
                  class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                />
              </Field>
            )}
          </form.Field>
        </div>
      </Field.FieldSet>

      {/* フリガナグループ (ArkTypeにより全角カナに自動変換されます) */}
      <Field.FieldSet class="space-y-3">
        <Field.Legend class="text-sm font-semibold text-zinc-400">フリガナ</Field.Legend>
        <div class="grid grid-cols-2 gap-4">
          <form.Field name="last_kana">
            {(field) => (
              <Field 
                label="セイ" 
                labelClass="sr-only" 
                error={field().state.meta.errors[0]?.toString()}
              >
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  placeholder="セイ"
                  class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="first_kana">
            {(field) => (
              <Field 
                label="メイ" 
                labelClass="sr-only" 
                error={field().state.meta.errors[0]?.toString()}
              >
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  placeholder="メイ"
                  class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                />
              </Field>
            )}
          </form.Field>
        </div>
      </Field.FieldSet>

      <div class="grid grid-cols-2 gap-6">
        {/* 性別コード */}
        <form.Field name="gender_code">
          {(field) => (
            <Field label="性別" error={field().state.meta.errors[0]?.toString()}>
              <select
                value={field().state.value}
                onChange={(e) => field().handleChange(e.currentTarget.value as any)}
                class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none cursor-pointer"
              >
                <For each={GENDER_CODES}>
                  {(code) => <option value={code} class="bg-zinc-800">{code}</option>}
                </For>
              </select>
            </Field>
          )}
        </form.Field>

        {/* 生年月日 (dateUtils.ts の和暦ロジックを使用した DatePicker) */}
        <form.Field name="birthday">
          {(field) => (
            <EraDatePicker
              label="生年月日"
              value={field().state.value}
              onValueChange={(v) => field().handleChange(v)}
              error={field().state.meta.errors[0]?.toString()}
              placeholder="和暦を選択"
            />
          )}
        </form.Field>
      </div>

      <hr class="border-zinc-800" />

      <div class="grid grid-cols-2 gap-6">
        <form.Field name="tel">
          {(field) => (
            <Field label="電話番号" error={field().state.meta.errors[0]?.toString()}>
              <input
                type="tel"
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                placeholder="090-0000-0000"
                class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Field label="メールアドレス" error={field().state.meta.errors[0]?.toString()}>
              <input
                type="email"
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                placeholder="example@mail.com"
                class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
              />
            </Field>
          )}
        </form.Field>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4 items-end">
          <form.Field name="zip">
            {(field) => (
              <Field label="郵便番号" error={field().state.meta.errors[0]?.toString()}>
                <input
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  placeholder="1234567"
                  class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                />
              </Field>
            )}
          </form.Field>
          <div class="col-span-2">
            <form.Field name="addr1">
              {(field) => (
                <Field label="住所" error={field().state.meta.errors[0]?.toString()}>
                  <input
                    value={field().state.value}
                    onInput={(e) => field().handleChange(e.currentTarget.value)}
                    placeholder="都道府県・市区町村・番地"
                    class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </div>

        <form.Field name="addr2">
          {(field) => (
            <Field label="建物名・部屋番号" error={field().state.meta.errors[0]?.toString()}>
              <input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                placeholder="マンション名など"
                class="flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {(state) => (
          <Button
            type="submit"
            disabled={!state()[0]}
            class="w-full h-12 bg-zinc-100 text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {state()[1] ? '登録処理中...' : 'Px を登録する'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};