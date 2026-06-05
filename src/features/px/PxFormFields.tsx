// src/features/px/PxFormFields.tsx
import { EraDatePicker } from '@/components/ui/DatePicker/EraDatePicker';
import { Field } from '@/components/ui/Field';
import { FieldSet } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input/Input';
import type { IsoDateString } from '@/types/date';

// 🌟 formオブジェクトそのものを汎用型 T としてパススルーします。
// これにより、TanStack Formのバージョンや内部ジェネリクスに一切依存しなくなります。
interface PxFormFieldsProps<T> {
  form: T;
}

export const PxFormFields = <T,>(props: PxFormFieldsProps<T>) => {
  // 小文字の Field コンポーネントおよび各種操作関数に型を損なわずアクセスするため、
  // 内部で安全に抽象化バインドを行います。
  // biome-ignore lint/suspicious/noExplicitAny: SolidJSのJSXとTanStack内部プロパティを調停するための最小限のキャスト
  const targetForm = props.form as any;
  const FormField = targetForm.Field;

  return (
    <div class="space-y-6">
      {/* 氏名グループを FieldSet でセマンティックに包む */}
      <FieldSet
        label="患者氏名"
        helperText="カルテに記載する氏名を入力してください。"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 姓 (last_name) */}
          <FormField name="last_name">
            {/* biome-ignore lint/suspicious/noExplicitAny: SolidJSのJSXとTanStack内部プロパティを調停するための最小限のキャスト */}
            {(field: any) => (
              <Field error={field().state.meta.errors?.join(', ')}>
                <Input
                  id="px-last-name"
                  value={(field().state.value as string) ?? ''}
                  onInput={(e) => {
                    field().handleChange(e.target.value);
                  }}
                  placeholder="姓"
                />
              </Field>
            )}
          </FormField>

          {/* 名 (first_name) */}
          <FormField name="first_name">
            {/* biome-ignore lint/suspicious/noExplicitAny: SolidJSのJSXとTanStack内部プロパティを調停するための最小限のキャスト */}
            {(field: any) => (
              <Field error={field().state.meta.errors?.join(', ')}>
                <Input
                  id="px-first-name"
                  value={(field().state.value as string) ?? ''}
                  onInput={(e) => {
                    field().handleChange(e.target.value);
                  }}
                  placeholder="名"
                />
              </Field>
            )}
          </FormField>
        </div>
      </FieldSet>

      {/* 生年月日 (birthday) */}
      <FormField name="birthday">
        {/* biome-ignore lint/suspicious/noExplicitAny: SolidJSのJSXとTanStack内部プロパティを調停するための最小限のキャスト */}
        {(field: any) => (
          <Field label="生年月日" error={field().state.meta.errors?.join(', ')}>
            <EraDatePicker
              value={
                field().state.value === ''
                  ? null
                  : (field().state.value as IsoDateString)
              }
              onDateChange={(isoDate) => {
                field().handleChange(isoDate ?? '');
              }}
              placeholder="日付を選択 (例: 令和...)"
            />
          </Field>
        )}
      </FormField>
    </div>
  );
};
