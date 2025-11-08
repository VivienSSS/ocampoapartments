'use client';

import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../input-group';
import { useFieldContext } from '..';
import {
  ClearButtonAddon,
  TextAddon,
  ValidationAddon,
} from '../utils/input-group-patterns';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type EmailFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // InputGroup addon support
  textAddonEnd?: string;
  iconAddonEnd?: React.ReactNode;
  showClearButton?: boolean;
  showValidationIcon?: boolean;
  inputGroupClassName?: string;
  // Composition fallback
  addonEnd?: React.ReactNode;
} & Omit<
  React.ComponentProps<'input'>,
  keyof {
    textAddonEnd: any;
    iconAddonEnd: any;
    showClearButton: any;
    showValidationIcon: any;
    inputGroupClassName: any;
    addonEnd: any;
    tooltip: any;
    tooltipSide: any;
  }
>;

const EmailField = (props: EmailFieldProps) => {
  const field = useFieldContext<string>();

  const {
    label,
    description,
    tooltip,
    tooltipSide,
    textAddonEnd,
    iconAddonEnd,
    showClearButton = false,
    showValidationIcon = true, // Default to true for email validation feedback
    inputGroupClassName,
    addonEnd,
    ...inputProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValid =
    field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;

  const handleClear = () => {
    field.handleChange('');
  };

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        htmlFor={field.name}
        tooltip={tooltip}
        tooltipSide={tooltipSide}
      >
        {label}
      </TooltipFieldLabel>
      <InputGroup className={inputGroupClassName}>
        {/* Input */}
        <InputGroupInput
          id={field.name}
          name={field.name}
          type="email"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          {...inputProps}
        />

        {/* End addons */}
        {addonEnd && (
          <InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>
        )}
        {showValidationIcon && (
          <InputGroupAddon align="inline-end">
            <ValidationAddon isValid={isValid} isError={isInvalid} />
          </InputGroupAddon>
        )}
        {showClearButton && field.state.value && (
          <InputGroupAddon align="inline-end">
            <ClearButtonAddon onClick={handleClear} />
          </InputGroupAddon>
        )}
        {textAddonEnd && (
          <InputGroupAddon align="inline-end">
            <TextAddon text={textAddonEnd} />
          </InputGroupAddon>
        )}
        {iconAddonEnd && (
          <InputGroupAddon align="inline-end">{iconAddonEnd}</InputGroupAddon>
        )}
      </InputGroup>
      <FieldDescription>{description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default EmailField;
