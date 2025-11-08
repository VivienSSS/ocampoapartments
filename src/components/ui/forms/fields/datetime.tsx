'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { Calendar } from '../../calendar';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../../input-group';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type DateTimeFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  showTime?: boolean;
  timeStep?: number;
  inputGroupClassName?: string;
  showCalendarIcon?: boolean;
  placeholder?: string;
  required?: boolean;
};

const DateTimeField = (props: DateTimeFieldProps) => {
  const {
    showTime = true,
    timeStep = 15,
    inputGroupClassName,
    showCalendarIcon = true,
  } = props;
  const field = useFieldContext<Date>();
  const [open, setOpen] = React.useState(false);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const dateValue = field.state.value;
  const dateFormatted = dateValue
    ? format(dateValue, showTime ? 'PPP HH:mm' : 'PPP')
    : 'Pick a date';

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Preserve time if it exists
      if (dateValue instanceof Date && showTime) {
        const newDate = new Date(date);
        newDate.setHours(dateValue.getHours());
        newDate.setMinutes(dateValue.getMinutes());
        field.handleChange(newDate);
      } else {
        field.handleChange(date);
      }
      setOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    if (dateValue instanceof Date) {
      const newDate = new Date(dateValue);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      field.handleChange(newDate);
    }
  };

  const timeValue = dateValue
    ? `${String(dateValue.getHours()).padStart(2, '0')}:${String(
        dateValue.getMinutes(),
      ).padStart(2, '0')}`
    : '00:00';

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <div className="flex flex-col gap-3">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <InputGroup className={inputGroupClassName}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="outline"
                data-empty={!dateValue}
                className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal flex-1"
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                type="button"
              >
                {showCalendarIcon && <CalendarIcon className="mr-2 size-4" />}
                {dateFormatted}
              </InputGroupButton>
            </PopoverTrigger>
            {!showTime && (
              <InputGroupAddon align="inline-end">
                <CalendarIcon className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            )}
          </InputGroup>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        {showTime && (
          <InputGroup className={inputGroupClassName}>
            <InputGroupInput
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              onBlur={field.handleBlur}
              step={timeStep}
              aria-invalid={isInvalid}
            />
            <InputGroupAddon align="inline-end">
              <span className="text-xs text-muted-foreground">
                Step {timeStep}min
              </span>
            </InputGroupAddon>
          </InputGroup>
        )}
      </div>
      <FieldDescription>{props.description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default DateTimeField;
