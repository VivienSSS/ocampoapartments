import { cn } from '@/lib/utils';
import { useFieldContext } from '../ui/form';
import { Label } from '../ui/label';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '../ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

const SelectField = ({
    className,
    label,
    multiple,
    options,
    placeholder,
    ...props
}: React.ComponentProps<'input'> & {
    label?: string;
    multiple?: boolean;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}) => {
    const field = useFieldContext<string | string[]>();

    return (
        <div className={cn('grid gap-2.5', className)}>
            {label && <Label htmlFor={props.id}>{label}</Label>}
            {multiple ? (
                <MultiSelect>
                    <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder={placeholder} />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {options.map((option) => (
                                <MultiSelectItem value={option.value}>
                                    {option.icon && <option.icon />} {option.label}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            ) : (
                <Select
                    onValueChange={field.handleChange}
                    value={field.state.value as string}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem value={option.value}>
                                {option.icon && <option.icon />} {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {field.state.meta.errorMap.onSubmit && (
                <Label className="text-destructive">
                    {field.state.meta.errorMap.onSubmit.message}
                </Label>
            )}
        </div>
    );
};

export default SelectField;