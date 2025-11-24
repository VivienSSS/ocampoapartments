'use client';

import React from 'react';
import { FieldDescription, FieldError } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '../../input-group';
import { useFieldContext } from '..';
import {
  ClearButtonAddon,
  CharCountAddon,
  PasswordToggleAddon,
  TextAddon,
  ValidationAddon,
} from '../utils/input-group-patterns';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type InputFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // Component variant
  variant?: 'input' | 'textarea';
  // InputGroup addon support
  textAddonStart?: string;
  textAddonEnd?: string;
  iconAddonStart?: React.ReactNode;
  iconAddonEnd?: React.ReactNode;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  showValidationIcon?: boolean;
  showCharCount?: boolean;
  inputGroupClassName?: string;
  // Composition fallback
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
  // Exclude extracted props from native input props
  readonly?: boolean;
} & Omit<
  React.ComponentProps<'input'>,
  | 'readonly'
  | 'textAddonStart'
  | 'textAddonEnd'
  | 'iconAddonStart'
  | 'iconAddonEnd'
  | 'showClearButton'
  | 'showPasswordToggle'
  | 'showValidationIcon'
  | 'showCharCount'
  | 'inputGroupClassName'
  | 'addonStart'
  | 'addonEnd'
  | 'tooltip'
  | 'tooltipSide'
  | 'variant'
>;

const InputField = (props: InputFieldProps) => {
  const field = useFieldContext<string>();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const {
    label,
    description,
    tooltip,
    tooltipSide,
    variant = 'input',
    textAddonStart,
    textAddonEnd,
    iconAddonStart,
    iconAddonEnd,
    showClearButton = false,
    showPasswordToggle = false,
    showValidationIcon = false,
    showCharCount = false,
    inputGroupClassName,
    addonStart,
    addonEnd,
    maxLength,
    ...inputProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValid =
    field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;
  const currentLength = field.state.value?.length ?? 0;

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

  const isTextarea = variant === 'textarea';

  return (
    <>
      {label && (
        <TooltipFieldLabel
          htmlFor={field.name}
          tooltip={tooltip}
          tooltipSide={tooltipSide}
        >
          {label}
        </TooltipFieldLabel>
      )}
      <InputGroup className={inputGroupClassName}>
        {/* Start addons */}
        {!isTextarea && addonStart && (
          <InputGroupAddon>{addonStart}</InputGroupAddon>
        )}
        {!isTextarea && textAddonStart && <TextAddon text={textAddonStart} />}
        {!isTextarea && iconAddonStart && (
          <InputGroupAddon>{iconAddonStart}</InputGroupAddon>
        )}

        {isTextarea && addonStart && (
          <InputGroupAddon data-align="block-start">
            {addonStart}
          </InputGroupAddon>
        )}

        {/* Input or Textarea */}
        {isTextarea ? (
          <InputGroupTextarea
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={isInvalid}
            maxLength={maxLength}
            {...(inputProps as React.ComponentProps<'textarea'>)}
          />
        ) : (
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
        )}

        {/* End addons */}
        {!isTextarea && (
          <>
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
              <InputGroupAddon align="inline-end">
                {iconAddonEnd}
              </InputGroupAddon>
            )}
          </>
        )}

        {isTextarea && (showCharCount || addonEnd) && (
          <InputGroupAddon align="block-end">
            {addonEnd}
            {showCharCount && (
              <CharCountAddon current={currentLength} max={maxLength} />
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </>
  );
};

export default InputField;
