import type React from 'react';
import { Checkbox } from '../../checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
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
    <Component
      id={field.name}
      checked={field.state.value ?? false}
      onCheckedChange={(checked) => field.handleChange(checked === true)}
      onBlur={field.handleBlur}
      aria-invalid={isInvalid}
    />
  );
};

export default BoolField;
