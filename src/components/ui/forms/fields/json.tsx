import React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../field";
import { Textarea as TextareaComponent } from "../../textarea";
import { useFieldContext } from "..";
import { TooltipFieldLabel } from "../utils/tooltip-field-label";

export type JSONFieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	tooltip?: React.ReactNode;
	tooltipSide?: "top" | "right" | "bottom" | "left";
};

const JSONField = (props: JSONFieldProps) => {
	const field = useFieldContext<Record<string, unknown>>();

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	const stringValue = field.state.value
		? JSON.stringify(field.state.value, null, 2)
		: "";

	return (
		<Field data-invalid={isInvalid}>
			<TooltipFieldLabel
				htmlFor={field.name}
				tooltip={props.tooltip}
				tooltipSide={props.tooltipSide}
			>
				{props.label}
			</TooltipFieldLabel>
			<TextareaComponent
				id={field.name}
				name={field.name}
				value={stringValue}
				onBlur={field.handleBlur}
				onChange={(e) => {
					try {
						const parsed = JSON.parse(e.target.value);
						field.handleChange(parsed);
					} catch {
						// Keep raw value until valid JSON
					}
				}}
				aria-invalid={isInvalid}
				placeholder="JSON field (TODO: implement)"
				disabled
			/>
			<FieldDescription>{props.description}</FieldDescription>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};

export default JSONField;
