'use client';

import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '../../input-group';
import { useFieldContext } from '..';
import { CharCountAddon } from '../utils/input-group-patterns';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type TextareaFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  // InputGroup addon support
  showCharCount?: boolean;
  inputGroupClassName?: string;
  // Composition fallback
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
} & Omit<
  React.ComponentProps<'textarea'>,
  keyof {
    showCharCount: any;
    inputGroupClassName: any;
    addonStart: any;
    addonEnd: any;
    tooltip: any;
    tooltipSide: any;
  }
>;

const TextareaField = (props: TextareaFieldProps) => {
  const field = useFieldContext<string>();

  const {
    label,
    description,
    tooltip,
    tooltipSide,
    showCharCount = false,
    inputGroupClassName,
    addonStart,
    addonEnd,
    maxLength,
    ...textareaProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const currentLength = field.state.value?.length ?? 0;

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
        {/* Start addon */}
        {addonStart && (
          <InputGroupAddon data-align="block-start">
            {addonStart}
          </InputGroupAddon>
        )}

        {/* Textarea */}
        <InputGroupTextarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          {...textareaProps}
        />

        {/* End addon - character count and custom addons */}
        {(showCharCount || addonEnd) && (
          <InputGroupAddon align="block-end">
            {addonEnd}
            {showCharCount && (
              <CharCountAddon current={currentLength} max={maxLength} />
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldDescription>{description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default TextareaField;
