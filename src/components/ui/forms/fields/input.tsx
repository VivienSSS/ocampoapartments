'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FieldDescription } from '../../field';
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
  // File upload support
  showFileList?: boolean;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
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
  | 'showFileList'
  | 'maxFileSize'
  | 'allowedFileTypes'
>;

const InputField = (props: InputFieldProps) => {
  const field = useFieldContext<string | File[]>();
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
    showFileList = false,
    maxFileSize,
    allowedFileTypes,
    ...inputProps
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValid =
    field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;
  const currentLength = field.state.value?.length ?? 0;
  const isFileInput = inputProps.type === 'file';
  const files = isFileInput ? (field.state.value as File[]) : [];

  // Determine input type
  const inputType =
    showPasswordToggle && inputProps.type === 'password'
      ? passwordVisible
        ? 'text'
        : 'password'
      : inputProps.type;

  const handleClear = () => {
    if (isFileInput) {
      field.setValue([]);
    } else {
      field.handleChange('');
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    field.setValue(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }
    if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    return null;
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
            value={field.state.value as string}
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
            {...(isFileInput ? {} : { value: field.state.value as string })}
            onBlur={field.handleBlur}
            onChange={(e) => {
              if (inputType === 'file') {
                field.setValue(Array.from(e.target.files || []));
                return;
              }
              field.handleChange(e.target.value);
            }}
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

      {/* File list display */}
      {showFileList && isFileInput && files.length > 0 && (
        <div className="mt-3 space-y-2 rounded-md border border-border bg-card p-3">
          <div className="text-sm font-medium text-foreground">
            Uploaded files ({files.length})
          </div>
          <ul className="space-y-1">
            {files.map((file, index) => {
              const fileError = validateFile(file);
              return (
                <li
                  key={`${file.name}-${index}`}
                  className={`flex items-center justify-between rounded border px-3 py-2 ${
                    fileError
                      ? 'border-destructive bg-destructive/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium truncate ${
                        fileError ? 'text-destructive' : 'text-foreground'
                      }`}
                    >
                      {file.name}
                    </span>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        fileError ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      {formatFileSize(file.size)}
                    </span>
                    {fileError && (
                      <span className="text-xs text-destructive">
                        {fileError}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );
};

export default InputField;
