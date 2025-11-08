'use client';

import type React from 'react';
import { Field, FieldDescription, FieldError } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../input-group';
import { useFieldContext } from '..';
import { TextAddon, ValidationAddon } from '../utils/input-group-patterns';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type NumberFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // InputGroup addon support
  textAddonStart?: string;
  textAddonEnd?: string;
  iconAddonEnd?: React.ReactNode;
  showClearButton?: boolean;
  showValidationIcon?: boolean;
  showSpinners?: boolean;
  inputGroupClassName?: string;
  // Composition fallback
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
} & Omit<
  React.ComponentProps<'input'>,
  | 'textAddonStart'
  | 'textAddonEnd'
  | 'iconAddonEnd'
  | 'showClearButton'
  | 'showValidationIcon'
  | 'showSpinners'
  | 'inputGroupClassName'
  | 'addonStart'
  | 'addonEnd'
  | 'tooltip'
  | 'tooltipSide'
>;

const NumberField = (props: NumberFieldProps) => {
  const field = useFieldContext<number>();

  const {
    label,
    description,
    tooltip,
    tooltipSide,
    textAddonStart,
    textAddonEnd,
    iconAddonEnd,
    showValidationIcon = false,
    inputGroupClassName,
    addonStart,
    addonEnd,
    ...inputProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValid =
    field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;

  const currentValue = field.state.value;

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
        {/* Start addons */}
        {addonStart && <InputGroupAddon>{addonStart}</InputGroupAddon>}
        {textAddonStart && <TextAddon text={textAddonStart} />}

        {/* Input */}
        <InputGroupInput
          id={field.name}
          name={field.name}
          type="number"
          value={currentValue}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(Number(e.target.value))}
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

export default NumberField;
