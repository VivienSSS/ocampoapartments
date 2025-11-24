import type z from 'zod';
import { Mail, Globe, Hash, FileText } from 'lucide-react';
import type { FieldSchema, FieldSetSchema } from './schema';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../field';
import { withForm } from '../forms';

const AutoFieldSet = withForm({
  // biome-ignore lint/suspicious/noExplicitAny: acceptable use of any here
  defaultValues: {} as any,
  props: {} as { schema: z.infer<typeof FieldSetSchema> },
  render: ({ form, ...props }) => {
    const { schema } = props;
    return (
      <FieldSet>
        {schema.legend && (
          <FieldLegend variant={schema.legend.variant}>
            {schema.legend.text}
          </FieldLegend>
        )}
        {schema.groups.map((field, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: acceptable use of index as key
          <AutoField form={form} key={index} schema={field} />
        ))}
      </FieldSet>
    );
  },
});

export const AutoField = withForm({
  // biome-ignore lint/suspicious/noExplicitAny: acceptable use of any here
  defaultValues: {} as any,
  props: {} as { schema: z.infer<typeof FieldSchema> },
  render: ({ form, ...props }) => {
    const { schema } = props;
    return (
      <form.AppField name={schema.name}>
        {(field) => {
          let FieldComponent: React.ReactNode = null;

          switch (schema.type) {
            case 'text':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="text"
                  showValidationIcon
                />
              );
              break;
            case 'bool':
              FieldComponent = <field.BoolField {...schema.config} />;
              break;
            case 'number':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="number"
                  iconAddonEnd={<Hash className="size-4" />}
                  showValidationIcon
                />
              );
              break;
            case 'email':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="email"
                  iconAddonEnd={<Mail className="size-4" />}
                  showClearButton
                  showValidationIcon
                />
              );
              break;
            case 'url':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="url"
                  iconAddonEnd={<Globe className="size-4" />}
                  showClearButton
                  showValidationIcon
                />
              );
              break;
            case 'date':
              FieldComponent = (
                <field.DateTimeField {...schema.config} showCalendarIcon />
              );
              break;
            case 'select':
              FieldComponent = <field.SelectField {...schema.config} />;
              break;
            case 'file':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="file"
                  iconAddonEnd={<FileText className="size-4" />}
                />
              );
              break;
            case 'relation':
              FieldComponent = <field.RelationField {...schema.config} />;
              break;
            case 'textarea':
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  variant="textarea"
                  showCharCount
                  showValidationIcon
                />
              );
              break;
            default:
              FieldComponent = (
                <field.InputField
                  {...schema.config}
                  type="text"
                  showValidationIcon
                />
              );
          }

          return (
            <Field
              orientation={schema.orientation}
              data-invalid={!field.state.meta.isValid}
            >
              <FieldLabel htmlFor={field.name}>{schema.label}</FieldLabel>
              {schema.title ? (
                <FieldContent>
                  <FieldTitle>{schema.title}</FieldTitle>
                  {FieldComponent}
                  <FieldDescription>{schema.description}</FieldDescription>
                </FieldContent>
              ) : (
                <>
                  {FieldComponent}
                  <FieldDescription>{schema.description}</FieldDescription>
                </>
              )}
              <FieldError errors={field.state.meta.errors} />
            </Field>
          );
        }}
      </form.AppField>
    );
  },
});

export default AutoFieldSet;
