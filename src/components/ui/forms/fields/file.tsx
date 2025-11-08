import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import { Input } from '../../input';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type FileFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
};

const FileField = (props: FileFieldProps) => {
  const field = useFieldContext<File>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        htmlFor={field.name}
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="file"
        onBlur={field.handleBlur}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            field.setValue(files[0]);
          }
        }}
        aria-invalid={isInvalid}
      />
      <FieldDescription>{props.description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default FileField;
