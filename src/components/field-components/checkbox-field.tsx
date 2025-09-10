import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { useFieldContext } from '../ui/form';
import { Label } from '../ui/label';

const CheckBoxField = ({
    className,
    label,
    ...props
}: React.ComponentProps<'input'> & {
    label?: string;
}) => {
    const field = useFieldContext<boolean>();

    return (
        <div className={cn('flex flex-row gap-2.5', className)}>
            <div className="flex gap-2.5">
                <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
            </div>
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
            {field.state.meta.errorMap.onSubmit && (
                <Label className="text-destructive">
                    {field.state.meta.errorMap.onSubmit.message}
                </Label>
            )}
        </div>
    );
};

export default CheckBoxField;