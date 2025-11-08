"use client";

import { HelpCircle } from "lucide-react";
import React from "react";
import { FieldLabel } from "../../field";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

type TooltipFieldLabelProps = React.ComponentProps<typeof FieldLabel> & {
	tooltip?: React.ReactNode;
	tooltipSide?: "top" | "right" | "bottom" | "left";
};

export const TooltipFieldLabel = ({
	tooltip,
	tooltipSide = "top",
	children,
	...props
}: TooltipFieldLabelProps) => {
	if (!tooltip) {
		return <FieldLabel {...props}>{children}</FieldLabel>;
	}

	return (
		<FieldLabel {...props}>
			<div className="flex items-center gap-1">
				{children}
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							className="inline-flex items-center justify-center cursor-help"
							tabIndex={-1}
						>
							<HelpCircle className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
						</button>
					</TooltipTrigger>
					<TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
				</Tooltip>
			</div>
		</FieldLabel>
	);
};
