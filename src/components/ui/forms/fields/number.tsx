"use client";

import React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group";
import { useFieldContext } from "..";
import {
	ClearButtonAddon,
	NumberSpinnerAddon,
	TextAddon,
	ValidationAddon,
} from "../utils/input-group-patterns";
import { TooltipFieldLabel } from "../utils/tooltip-field-label";

export type NumberFieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	tooltip?: React.ReactNode;
	tooltipSide?: "top" | "right" | "bottom" | "left";
	// InputGroup addon support
	textAddonStart?: string;
	textAddonEnd?: string;
	iconAddonEnd?: React.ReactNode;
	showClearButton?: boolean;
	showValidationIcon?: boolean;
	showSpinners?: boolean;
	inputGroupClassName?: string;
	// Composition fallback
	addonStart?: React.ReactNode;
	addonEnd?: React.ReactNode;
} & Omit<
	React.ComponentProps<"input">,
	keyof {
		textAddonStart: any;
		textAddonEnd: any;
		iconAddonEnd: any;
		showClearButton: any;
		showValidationIcon: any;
		showSpinners: any;
		inputGroupClassName: any;
		addonStart: any;
		addonEnd: any;
		tooltip: any;
		tooltipSide: any;
	}
>;

const NumberField = (props: NumberFieldProps) => {
	const field = useFieldContext<number>();

	const {
		label,
		description,
		tooltip,
		tooltipSide,
		textAddonStart,
		textAddonEnd,
		iconAddonEnd,
		showClearButton = false,
		showValidationIcon = false,
		showSpinners = false,
		inputGroupClassName,
		addonStart,
		addonEnd,
		min,
		max,
		step = 1,
		...inputProps
	} = props;

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const isValid =
		field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;

	const currentValue = field.state.value ?? 0;

	const handleIncrement = () => {
		const newValue = currentValue + (typeof step === "number" ? step : 1);
		if (max === undefined || newValue <= Number(max)) {
			field.handleChange(newValue);
		}
	};

	const handleDecrement = () => {
		const newValue = currentValue - (typeof step === "number" ? step : 1);
		if (min === undefined || newValue >= Number(min)) {
			field.handleChange(newValue);
		}
	};

	const handleClear = () => {
		field.handleChange(0);
	};

	const canIncrement = max === undefined || currentValue < Number(max);
	const canDecrement = min === undefined || currentValue > Number(min);

	return (
		<Field data-invalid={isInvalid}>
			<TooltipFieldLabel
				htmlFor={field.name}
				tooltip={tooltip}
				tooltipSide={tooltipSide}
			>
				{label}
			</TooltipFieldLabel>
			<InputGroup className={inputGroupClassName}>
				{/* Start addons */}
				{addonStart && <InputGroupAddon>{addonStart}</InputGroupAddon>}
				{textAddonStart && <TextAddon text={textAddonStart} />}

				{/* Input */}
				<InputGroupInput
					id={field.name}
					name={field.name}
					type="number"
					value={currentValue}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(Number(e.target.value))}
					aria-invalid={isInvalid}
					min={min}
					max={max}
					step={step}
					{...inputProps}
				/>

				{/* End addons */}
				{addonEnd && (
					<InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>
				)}
				{showValidationIcon && (
					<InputGroupAddon align="inline-end">
						<ValidationAddon isValid={isValid} isError={isInvalid} />
					</InputGroupAddon>
				)}
				{showClearButton && currentValue !== 0 && (
					<InputGroupAddon align="inline-end">
						<ClearButtonAddon onClick={handleClear} />
					</InputGroupAddon>
				)}
				{showSpinners && (
					<InputGroupAddon align="inline-end">
						<NumberSpinnerAddon
							onIncrement={handleIncrement}
							onDecrement={handleDecrement}
							disabled={!canIncrement || !canDecrement}
						/>
					</InputGroupAddon>
				)}
				{textAddonEnd && (
					<InputGroupAddon align="inline-end">
						<TextAddon text={textAddonEnd} />
					</InputGroupAddon>
				)}
				{iconAddonEnd && (
					<InputGroupAddon align="inline-end">{iconAddonEnd}</InputGroupAddon>
				)}
			</InputGroup>
			<FieldDescription>{description}</FieldDescription>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};

export default NumberField;
