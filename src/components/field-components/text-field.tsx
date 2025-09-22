import { Eye, EyeClosed } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { Button } from '../ui/button.tsx';
import { useFieldContext } from '../ui/form.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';

const TextField = ({
  className,
  label,
  ...props
}: React.ComponentProps<'input'> & {
  label?: string;
}) => {
  const field = useFieldContext<string>();
  const [inputType, setInputType] = useState<string | undefined>(props.type);

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
        <Input
          aria-invalid={!!field.state.meta.errorMap.onSubmit}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          id={props.id}
          {...props}
          type={inputType}
        />
        {props.type === 'password' && (
          <Button
            onClick={() => {
              if (inputType === 'password') {
                setInputType('text');
              } else {
                setInputType('password');
              }
            }}
            type="button"
            variant={'outline'}
            size={'icon'}
          >
            {inputType === 'password' ? <Eye /> : <EyeClosed />}
          </Button>
        )}
      </div>
      {field.state.meta.errorMap.onSubmit && (
        <Label className="text-destructive">
          {field.state.meta.errorMap.onSubmit.message}
        </Label>
      )}
    </div>
  );
};

export default TextField;
