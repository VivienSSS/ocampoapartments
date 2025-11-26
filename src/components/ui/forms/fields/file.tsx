import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import { Input } from '../../input';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type FileFieldProps = React.ComponentProps<'input'>;

const FileField = (props: FileFieldProps) => {
  const field = useFieldContext<File[]>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Input
      id={field.name}
      name={field.name}
      type="file"
      onBlur={field.handleBlur}
      onChange={(e) => {
        const files = e.target.files;
        field.setValue(Array.from(files || []));
      }}
      aria-invalid={isInvalid}
      {...props}
    />
  );
};

export default FileField;
