import { ZipCombo } from '@/components/ui/Combobox/ZipCombo';
import { DatePicker } from '@/components/ui/DatePicker';
import { datePickerRegistry } from '@/components/ui/DatePicker/registry';
import { Field } from '@/components/ui/Field';
import { FieldSet } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select';

interface PxFormFieldsProps<T> {
  form: T;
}

export const PxFormFields = <T,>(props: PxFormFieldsProps<T>) => {
  // TanStack Formのフィールドコンポーネントを取得
  const targetForm = props.form as any;
  const FormField = targetForm.Field;

  return (
    <div class="space-y-6">
      {/* 氏名グループ */}
      <FieldSet fieldSet={{ label: '患者氏名' }}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="last_name" status={{ required: true }}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                label="姓"
                value={field().state.value ?? ''}
                onInput={(e: InputEvent) =>
                  field().handleChange((e.target as HTMLInputElement).value)
                }
                error={field().state.meta.errors[0]}
              />
            )}
          </FormField>
          <FormField name="first_name" status={{ required: true }}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                label="名"
                value={field().state.value ?? ''}
                onInput={(e: InputEvent) =>
                  field().handleChange((e.target as HTMLInputElement).value)
                }
                error={field().state.meta.errors[0]}
              />
            )}
          </FormField>
        </div>
      </FieldSet>

      {/* 氏名カナ */}
      <FieldSet fieldSet={{ label: '患者氏名カナ' }}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="last_kana" status={{ required: true }}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                label="セイ"
                value={field().state.value ?? ''}
                onInput={(e: InputEvent) =>
                  field().handleChange((e.target as HTMLInputElement).value)
                }
                error={field().state.meta.errors[0]}
              />
            )}
          </FormField>
          <FormField name="first_kana" status={{ required: true }}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                label="メイ"
                value={field().state.value ?? ''}
                onInput={(e: InputEvent) =>
                  field().handleChange((e.target as HTMLInputElement).value)
                }
                error={field().state.meta.errors[0]}
              />
            )}
          </FormField>
        </div>
      </FieldSet>

      {/* 性別・生年月日 */}
      <Field field={{ label: '性別' }}>
        <FormField name="gender_code">
          {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
          {(field: any) => (
            <Select
              value={field().state.value ?? ''}
              onChange={(e) => field().handleChange(e.target.value)}
            >
              <option value="m">男性</option>
              <option value="f">女性</option>
            </Select>
          )}
        </FormField>
      </Field>

      <FormField name="birthday">
        {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
        {(field: any) => (
          <DatePicker
            field={{ label: '生年月日' }}
            status={{}}
            state={{
              value: field().state.value ? [field().state.value] : [],
              onValueChange: (val: any) => field().handleChange(val[0]),
            }}
            config={datePickerRegistry.japanese}
          />
        )}
      </FormField>

      {/* 連絡先 */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field field={{ label: '電話番号' }} status={{ required: true }}>
          <FormField name="tel">
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                value={field().state.value ?? ''}
                onInput={(e) => field().handleChange(e.target.value)}
              />
            )}
          </FormField>
        </Field>
        <Field field={{ label: 'メール' }}>
          <FormField name="email">
            {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
            {(field: any) => (
              <Input
                value={field().state.value ?? ''}
                onInput={(e) => field().handleChange(e.target.value)}
              />
            )}
          </FormField>
        </Field>
      </div>

      {/* 住所グループ */}
      <FieldSet fieldSet={{ label: '住所' }}>
        <FormField name="zip">
          {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
          {(field: any) => (
            <ZipCombo
              form={props.form}
              name="zip"
              targetName="addr1"
              field={{ label: '郵便番号' }}
            />
          )}
        </FormField>
        <FormField name="addr1">
          {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
          {(field: any) => (
            <Input
              label="住所1"
              value={field().state.value ?? ''}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        </FormField>
        <FormField name="addr2">
          {/* biome-ignore lint/suspicious/noExplicitAny: <field: any> */}
          {(field: any) => (
            <Input
              label="住所2"
              value={field().state.value ?? ''}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        </FormField>
      </FieldSet>
    </div>
  );
};
