import type React from 'react';
import { Checkbox } from '../../checkbox';
import { Field, FieldDescription, FieldError } from '../../field';
import { Switch } from '../../switch';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type BoolFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'checkbox' | 'switch';
};

const BoolField = (props: BoolFieldProps) => {
  const { variant = 'checkbox' } = props;
  const field = useFieldContext<boolean>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const Component = variant === 'switch' ? Switch : Checkbox;

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <Component
        id={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      <FieldDescription>{props.description}</FieldDescription>
      <FieldError errors={field.state.meta.errorMap.onSubmit} />
    </Field>
  );
};

export default BoolField;
