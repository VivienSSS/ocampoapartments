import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  BoolField,
  CheckboxGroupField,
  DateTimeField,
  EmailField,
  FileField,
  GeoPointField,
  ImageUploadField,
  JSONField,
  NumberField,
  RadioGroupField,
  RelationField,
  RichEditorField,
  SelectField,
  TextareaField,
  TextField,
  URLField,
} from './fields';
import FormDialog from './utils/dialog';
import InputField from './fields/input';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    BoolField,
    CheckboxGroupField,
    DateTimeField,
    EmailField,
    FileField,
    GeoPointField,
    ImageUploadField,
    JSONField,
    NumberField,
    RadioGroupField,
    RelationField,
    RichEditorField,
    SelectField,
    TextField,
    TextareaField,
    URLField,
    InputField,
  },
  formComponents: { FormDialog },
});
