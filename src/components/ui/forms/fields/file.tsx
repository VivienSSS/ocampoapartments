import type React from 'react';
import { Input } from '../../input';
import { useFieldContext } from '..';

export type FileFieldProps = React.ComponentProps<'input'>;

const FileField = (props: FileFieldProps) => {
  const field = useFieldContext<File[]>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Input
      id={field.name}
      name={field.name}
      type="file"
      onBlur={field.handleBlur}
      onChange={(e) => {
        const files = e.target.files;
        const parsedFiles: File[] = [];
        for (const file of files || []) {
          parsedFiles.push(file);
        }
        field.setValue(parsedFiles);
      }}
      aria-invalid={isInvalid}
      {...props}
    />
  );
};

export default FileField;
