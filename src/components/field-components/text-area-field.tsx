import type React from 'react';
import { cn } from '@/lib/utils.ts';
import { useFieldContext } from '../ui/form.tsx';
import { Label } from '../ui/label.tsx';
import { Textarea } from '../ui/textarea.tsx';

const TextAreaField = ({
  className,
  label,
  ...props
}: React.ComponentProps<'textarea'> & {
  label?: string;
}) => {
  const field = useFieldContext<string>();

  return (
    <div className={cn('grid gap-2.5', className)}>
      {label && (
        <Label
          className={cn(
            field.state.meta.errorMap.onSubmit && 'text-destructive',
          )}
          htmlFor={props.id}
        >
          {label}
        </Label>
      )}
      <div className="flex gap-2.5">
        <Textarea
          aria-invalid={!!field.state.meta.errorMap.onSubmit}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          id={props.id}
          {...props}
        />
      </div>
      {field.state.meta.errorMap.onSubmit && (
        <Label className="text-destructive">
          {field.state.meta.errorMap.onSubmit.message}
        </Label>
      )}
    </div>
  );
};

export default TextAreaField;
