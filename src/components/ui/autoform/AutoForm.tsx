import {
  type AutoFormUIComponents,
  AutoForm as BaseAutoForm,
} from '@autoform/react';
import { ArrayElementWrapper } from './components/ArrayElementWrapper';
import { ArrayWrapper } from './components/ArrayWrapper';
import { BooleanField } from './components/BooleanField';
import { DateField } from './components/DateField';
import { ErrorMessage } from './components/ErrorMessage';
import { FieldWrapper } from './components/FieldWrapper';
import { FileField } from './components/FileField';
import { Form } from './components/Form';
import { NumberField } from './components/NumberField';
import { ObjectWrapper } from './components/ObjectWrapper';
import { RelationField } from './components/RelationField';
import { SelectField } from './components/SelectField';
import { StringField } from './components/StringField';
import { SubmitButton } from './components/SubmitButton';
import { TextareaField } from './components/TextareaField';
import type { AutoFormProps } from './types';

const ShadcnUIComponents: AutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
  ObjectWrapper,
  ArrayWrapper,
  ArrayElementWrapper,
};

export const ShadcnAutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
  file: FileField,
  relation: RelationField,
  textarea: TextareaField,
} as const;
export type FieldTypes = keyof typeof ShadcnAutoFormFieldComponents;

export function AutoForm<T extends Record<string, any>>({
  uiComponents,
  formComponents,
  ...props
}: AutoFormProps<T>) {
  return (
    <BaseAutoForm
      {...props}
      uiComponents={{ ...ShadcnUIComponents, ...uiComponents }}
      formComponents={{ ...ShadcnAutoFormFieldComponents, ...formComponents }}
    />
  );
}
