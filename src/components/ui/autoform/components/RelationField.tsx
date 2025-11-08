import type { AutoFormFieldProps } from '@autoform/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '../../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';

export const RelationField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  id,
  field,
}) => {
  const values = field.fieldConfig?.customData?.fieldData?.() as {
    label: string;
    value: any;
  }[];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(inputProps.value);
  const { key, ...props } = inputProps;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          value={value}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
        >
          {value
            ? values.find((item) => item.value === value)?.label
            : 'Select Item...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command value={value}>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No record found.</CommandEmpty>
            <CommandGroup>
              {values.map((item) => (
                <CommandItem
                  keywords={[item.label]}
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? '' : currentValue;
                    setValue(newValue);

                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
