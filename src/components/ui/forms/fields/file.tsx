import type React from 'react';
import { Input } from '../../input';
import { Field, FieldDescription, FieldError } from '../../field';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type FileFieldProps = React.ComponentProps<'input'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
};

const FileField = (props: FileFieldProps) => {
  const field = useFieldContext<File[]>();
  const { label, description, tooltip, tooltipSide, ...inputProps } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        htmlFor={field.name}
        tooltip={tooltip}
        tooltipSide={tooltipSide}
      >
        {label}
      </TooltipFieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="file"
        onBlur={field.handleBlur}
        onChange={(e) => {
          const files = e.target.files;
          const parsedFiles: File[] = [];
          for (const file of files || []) {
            parsedFiles.push(file);
          }
          field.setValue(parsedFiles);
        }}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError errors={field.state.meta.errorMap.onSubmit} />
    </Field>
  );
};

export default FileField;
