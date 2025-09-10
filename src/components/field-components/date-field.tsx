import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { useFieldContext } from '../ui/form';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const DateField = ({
    className,
    label,
    ...props
}: React.ComponentProps<'input'> & {
    label?: string;
}) => {
    const field = useFieldContext<Date>();

    return (
        <div className={cn('grid gap-2.5', className)}>
            {label && <Label htmlFor={props.id}>{label}</Label>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!field.state.value}
                        className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                    >
                        <CalendarIcon />
                        {field.state.value ? (
                            format(field.state.value, 'PPP')
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        required
                        mode="single"
                        selected={field.state.value}
                        onSelect={field.handleChange}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DateField;