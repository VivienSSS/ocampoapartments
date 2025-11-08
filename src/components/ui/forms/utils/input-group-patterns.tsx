"use client";

import {
	CheckCircleIcon,
	CheckIcon,
	CopyIcon,
	EyeIcon,
	EyeOffIcon,
	XCircleIcon,
	XIcon,
} from "lucide-react";
import React from "react";
import { InputGroupButton, InputGroupText } from "@/components/ui/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Character count addon for textareas
 * Displays current character count and optional max limit
 */
export const CharCountAddon: React.FC<{
	current: number;
	max?: number;
	className?: string;
}> = ({ current, max, className }) => {
	const remaining = max ? max - current : undefined;

	return (
		<InputGroupText className={className}>
			{remaining !== undefined ? (
				<span className="text-xs">
					{remaining} character{remaining !== 1 ? "s" : ""} left
				</span>
			) : (
				<span className="text-xs">{current} characters</span>
			)}
		</InputGroupText>
	);
};

/**
 * Validation indicator addon
 * Shows checkmark for valid or error icon for invalid state
 */
export const ValidationAddon: React.FC<{
	isValid?: boolean;
	isError?: boolean;
	showTooltip?: boolean;
	tooltipText?: string;
}> = ({ isValid, isError, showTooltip = false, tooltipText }) => {
	if (!isValid && !isError) return null;

	const icon = isError ? (
		<XCircleIcon className="size-4 text-destructive" />
	) : (
		<CheckCircleIcon className="size-4 text-green-600" />
	);

	if (showTooltip && tooltipText) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="cursor-help">{icon}</div>
				</TooltipTrigger>
				<TooltipContent side="right">{tooltipText}</TooltipContent>
			</Tooltip>
		);
	}

	return icon;
};

/**
 * Clear button addon
 * Button that clears the input value on click
 */
export const ClearButtonAddon: React.FC<{
	onClick: () => void;
	disabled?: boolean;
	ariaLabel?: string;
}> = ({ onClick, disabled = false, ariaLabel = "Clear input" }) => {
	return (
		<InputGroupButton
			size="icon-xs"
			variant="ghost"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			title={ariaLabel}
		>
			<XIcon className="size-4" />
		</InputGroupButton>
	);
};

/**
 * Password visibility toggle addon
 * Toggles between showing and hiding password
 */
export const PasswordToggleAddon: React.FC<{
	visible: boolean;
	toggle: () => void;
	ariaLabel?: string;
}> = ({ visible, toggle, ariaLabel = "Toggle password visibility" }) => {
	return (
		<InputGroupButton
			size="icon-xs"
			variant="ghost"
			onClick={toggle}
			aria-label={ariaLabel}
			title={ariaLabel}
		>
			{visible ? (
				<EyeIcon className="size-4" />
			) : (
				<EyeOffIcon className="size-4" />
			)}
		</InputGroupButton>
	);
};

/**
 * Copy to clipboard button addon
 * Copies input value to clipboard with visual feedback
 */
export const CopyButtonAddon: React.FC<{
	value: string;
	isCopied?: boolean;
	onCopy?: () => void;
	ariaLabel?: string;
}> = ({ value, isCopied = false, onCopy, ariaLabel = "Copy to clipboard" }) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			onCopy?.();
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<InputGroupButton
			size="icon-xs"
			variant="ghost"
			onClick={handleCopy}
			aria-label={ariaLabel}
			title={ariaLabel}
		>
			{isCopied ? (
				<CheckIcon className="size-4 text-green-600" />
			) : (
				<CopyIcon className="size-4" />
			)}
		</InputGroupButton>
	);
};

/**
 * Increment button addon for number inputs
 * Contains both increment and decrement buttons
 */
export const NumberSpinnerAddon: React.FC<{
	onIncrement: () => void;
	onDecrement: () => void;
	disabled?: boolean;
	ariaLabelIncrement?: string;
	ariaLabelDecrement?: string;
}> = ({
	onIncrement,
	onDecrement,
	disabled = false,
	ariaLabelIncrement = "Increment",
	ariaLabelDecrement = "Decrement",
}) => {
	return (
		<div className="flex gap-1">
			<InputGroupButton
				size="icon-xs"
				variant="ghost"
				onClick={onDecrement}
				disabled={disabled}
				aria-label={ariaLabelDecrement}
				title={ariaLabelDecrement}
			>
				<span className="text-lg font-bold">−</span>
			</InputGroupButton>
			<InputGroupButton
				size="icon-xs"
				variant="ghost"
				onClick={onIncrement}
				disabled={disabled}
				aria-label={ariaLabelIncrement}
				title={ariaLabelIncrement}
			>
				<span className="text-lg font-bold">+</span>
			</InputGroupButton>
		</div>
	);
};

/**
 * Text prefix/suffix addon
 * Displays static text like currency symbols, units, or domain extensions
 */
export const TextAddon: React.FC<{
	text: string;
	className?: string;
}> = ({ text, className }) => {
	return <InputGroupText className={className}>{text}</InputGroupText>;
};

/**
 * Icon addon wrapper
 * Displays an icon in the addon with optional tooltip
 */
export const IconAddon: React.FC<{
	icon: React.ReactNode;
	tooltip?: string;
	className?: string;
}> = ({ icon, tooltip, className }) => {
	if (tooltip) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<div className={`cursor-help ${className || ""}`}>{icon}</div>
				</TooltipTrigger>
				<TooltipContent side="right">{tooltip}</TooltipContent>
			</Tooltip>
		);
	}

	return <div className={className}>{icon}</div>;
};
