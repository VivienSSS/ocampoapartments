import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import { RadioGroup, RadioGroupItem } from '../../radio-group';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

type RadioOption = { label: string; value: string };

export type RadioGroupFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  options: RadioOption[];
};

const RadioGroupField = (props: RadioGroupFieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <RadioGroup
        value={field.state.value ?? ''}
        onValueChange={field.handleChange}
      >
        {props.options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`${field.name}-${option.value}`}
              aria-invalid={isInvalid}
            />
            <label
              htmlFor={`${field.name}-${option.value}`}
              className="cursor-pointer text-sm"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      <FieldDescription>{props.description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default RadioGroupField;
