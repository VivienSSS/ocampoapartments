import React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select";
import { useFieldContext } from "..";
import { TooltipFieldLabel } from "../utils/tooltip-field-label";

type SelectOption = { label: string; value: string };

export type SelectFieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	tooltip?: React.ReactNode;
	tooltipSide?: "top" | "right" | "bottom" | "left";
	options: SelectOption[];
	placeholder?: string;
	required?: boolean;
};

const SelectField = (props: SelectFieldProps) => {
	const { placeholder = "Select an option..." } = props;
	const field = useFieldContext<string>();

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<TooltipFieldLabel
				tooltip={props.tooltip}
				tooltipSide={props.tooltipSide}
			>
				{props.label}
			</TooltipFieldLabel>
			<Select
				value={field.state.value ?? ""}
				onValueChange={field.handleChange}
			>
				<SelectTrigger id={field.name} aria-invalid={isInvalid}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{props.options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldDescription>{props.description}</FieldDescription>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};

export default SelectField;
