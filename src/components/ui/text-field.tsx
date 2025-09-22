import type React from 'react';
import { useFieldContext } from './form';
import { Input } from './input';
import { Label } from './label';

const TextField = ({
  label,
  ...props
}: React.ComponentProps<'input'> & { label?: string }) => {
  const field = useFieldContext<string>();

  return (
    <div>
      {label && <Label htmlFor={field.name}>{label}</Label>}
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default TextField;
