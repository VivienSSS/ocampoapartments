import React, { useState } from "react";
import { Button } from "../../button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../dialog";
import { useFormContext } from "..";

export type FormDialogProps = {
	trigger?: React.ReactNode;
	children: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	onSubmit?: () => void | Promise<void>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
} & Omit<
	React.ComponentProps<typeof Dialog>,
	"children" | "open" | "onOpenChange"
>;

const FormDialog = ({
	trigger,
	title,
	description,
	children,
	onSubmit,
	open: controlledOpen,
	onOpenChange: onControlledOpenChange,
	...dialogProps
}: FormDialogProps) => {
	const form = useFormContext();
	const [internalOpen, setInternalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Use controlled state if provided, otherwise use internal state
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(newOpen);
		}
		onControlledOpenChange?.(newOpen);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await form.handleSubmit();
			await onSubmit?.();
			if (!isControlled) {
				setInternalOpen(false);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClear = () => {
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...dialogProps}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="max-h-3/4 overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<Button
						variant="secondary"
						onClick={handleClear}
						disabled={isSubmitting}
					>
						Clear
					</Button>
					<Button
						variant="default"
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FormDialog;
