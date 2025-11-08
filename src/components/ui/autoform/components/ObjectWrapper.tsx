import type { ObjectWrapperProps } from '@autoform/react';
import type React from 'react';
import { FieldGroup, FieldTitle } from '../../field';

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({
  label,
  children,
}) => {
  return (
    <FieldGroup>
      <FieldTitle>{label}</FieldTitle>
      {children}
    </FieldGroup>
  );
};
