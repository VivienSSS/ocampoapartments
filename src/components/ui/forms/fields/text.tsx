'use client';

import React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../input-group';
import { useFieldContext } from '..';
import {
  ClearButtonAddon,
  PasswordToggleAddon,
  TextAddon,
  ValidationAddon,
} from '../utils/input-group-patterns';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type TextFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // InputGroup addon support
  textAddonStart?: string;
  textAddonEnd?: string;
  iconAddonStart?: React.ReactNode;
  iconAddonEnd?: React.ReactNode;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  showValidationIcon?: boolean;
  inputGroupClassName?: string;
  // Composition fallback
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
  // Exclude extracted props from native input props
  readonly?: boolean;
} & Omit<
  React.ComponentProps<'input'>,
  keyof {
    readonly: any;
    textAddonStart: any;
    textAddonEnd: any;
    iconAddonStart: any;
    iconAddonEnd: any;
    showClearButton: any;
    showPasswordToggle: any;
    showValidationIcon: any;
    inputGroupClassName: any;
    addonStart: any;
    addonEnd: any;
    tooltip: any;
    tooltipSide: any;
  }
>;

const TextField = (props: TextFieldProps) => {
  const field = useFieldContext<string>();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const {
    label,
    description,
    tooltip,
    tooltipSide,
    textAddonStart,
    textAddonEnd,
    iconAddonStart,
    iconAddonEnd,
    showClearButton = false,
    showPasswordToggle = false,
    showValidationIcon = false,
    inputGroupClassName,
    addonStart,
    addonEnd,
    ...inputProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValid =
    field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;

  // Determine input type
  const inputType =
    showPasswordToggle && inputProps.type === 'password'
      ? passwordVisible
        ? 'text'
        : 'password'
      : inputProps.type;

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
        {/* Start addons */}
        {addonStart && <InputGroupAddon>{addonStart}</InputGroupAddon>}
        {textAddonStart && <TextAddon text={textAddonStart} />}
        {iconAddonStart && <InputGroupAddon>{iconAddonStart}</InputGroupAddon>}

        {/* Input */}
        <InputGroupInput
          id={field.name}
          name={field.name}
          type={inputType}
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
        {showPasswordToggle && inputProps.type === 'password' && (
          <InputGroupAddon align="inline-end">
            <PasswordToggleAddon
              visible={passwordVisible}
              toggle={() => setPasswordVisible(!passwordVisible)}
            />
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

export default TextField;
