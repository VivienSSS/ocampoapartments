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
	TextAddon,
	ValidationAddon,
} from "../utils/input-group-patterns";
import { TooltipFieldLabel } from "../utils/tooltip-field-label";

export type URLFieldProps = {
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
		inputGroupClassName: any;
		addonStart: any;
		addonEnd: any;
		tooltip: any;
		tooltipSide: any;
	}
>;

const URLField = (props: URLFieldProps) => {
	const field = useFieldContext<string>();

	const {
		label,
		description,
		tooltip,
		tooltipSide,
		textAddonStart = "https://",
		textAddonEnd,
		iconAddonEnd,
		showClearButton = false,
		showValidationIcon = true, // Default to true for URL validation feedback
		inputGroupClassName,
		addonStart,
		addonEnd,
		...inputProps
	} = props;

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const isValid =
		field.state.meta.isTouched && field.state.meta.isValid && !isInvalid;

	const handleClear = () => {
		field.handleChange("");
	};

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
					type="url"
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					aria-invalid={isInvalid}
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
				{showClearButton && field.state.value && (
					<InputGroupAddon align="inline-end">
						<ClearButtonAddon onClick={handleClear} />
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

export default URLField;
