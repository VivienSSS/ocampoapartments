import type { FieldWrapperProps } from '@autoform/react';
import type React from 'react';
import { Label } from '@/components/ui/label';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../field';

const DISABLED_LABELS = ['boolean', 'object', 'array'];

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  children,
  id,
  field,
  error,
}) => {
  const isDisabled = DISABLED_LABELS.includes(field.type);

  return (
    <Field>
      {field.fieldConfig?.description ? (
        <FieldContent>
          {!isDisabled && (
            <FieldLabel htmlFor={id}>
              {label}
              {field.required && <span className="text-destructive"> *</span>}
            </FieldLabel>
          )}
          {children}
          <FieldDescription>{field.fieldConfig.description}</FieldDescription>
          <FieldError>{error}</FieldError>
        </FieldContent>
      ) : (
        <>
          {!isDisabled && (
            <FieldLabel htmlFor={id}>
              {label}
              {field.required && <span className="text-destructive"> *</span>}
            </FieldLabel>
          )}
          {children}
          <FieldError>{error}</FieldError>
        </>
      )}
    </Field>
  );
};
