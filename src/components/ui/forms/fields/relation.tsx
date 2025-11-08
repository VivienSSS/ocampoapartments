import { useRouteContext } from "@tanstack/react-router";
import React, { useCallback } from "react";
import { TypedPocketBase } from "@/lib/pb.types";
import { AsyncSelect } from "../../async-select";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../field";
import { useFieldContext } from "..";
import { TooltipFieldLabel } from "../utils/tooltip-field-label";

export interface RelationItem {
	id: string;
	[key: string]: unknown;
}

export type RelationFieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	tooltip?: React.ReactNode;
	tooltipSide?: "top" | "right" | "bottom" | "left";
	relationshipName: string;
	collectionName: string;
	displayField?: string;
	preload?: boolean;
	placeholder?: string;
	pocketbase: TypedPocketBase;
};

const RelationField = (props: RelationFieldProps) => {
	const field = useFieldContext<string>();
	const {
		collectionName,
		relationshipName,
		displayField = "name",
		preload = false,
		placeholder = "Search...",
	} = props;

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	// Fetcher function to query related records
	const fetcher = useCallback(
		async (query?: string): Promise<RelationItem[]> => {
			try {
				let filter = "";
				if (query) {
					filter = `${displayField} ~ "${query}"`;
				}

				const records = await props.pocketbase
					.collection(collectionName)
					.getList(1, 50, {
						filter: filter || undefined,
						sort: `-updated`,
					});

				return records.items as RelationItem[];
			} catch (error) {
				console.error("Failed to fetch relation records:", error);
				return [];
			}
		},
		[props.pocketbase, collectionName, displayField],
	);

	return (
		<Field data-invalid={isInvalid}>
			<TooltipFieldLabel
				htmlFor={field.name}
				tooltip={props.tooltip}
				tooltipSide={props.tooltipSide}
			>
				{props.label}
			</TooltipFieldLabel>
			<AsyncSelect<RelationItem>
				fetcher={fetcher}
				preload={preload}
				renderOption={(item) => (
					<div className="flex items-center justify-between w-full">
						<span>{String(item[displayField])}</span>
					</div>
				)}
				getOptionValue={(item) => item.id}
				getDisplayValue={(item) => String(item[displayField])}
				label={String(props.label || relationshipName)}
				placeholder={placeholder}
				value={field.state.value ?? ""}
				onChange={field.handleChange}
				notFound={
					<div className="py-6 text-center text-sm">No records found</div>
				}
				clearable={true}
			/>
			<FieldDescription>{props.description}</FieldDescription>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};

export default RelationField;
