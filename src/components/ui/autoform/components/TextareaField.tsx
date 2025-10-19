import { Textarea } from "@/components/ui/textarea";
import type { AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const TextareaField: React.FC<AutoFormFieldProps> = ({
    inputProps,
    error,
    id,
}) => {
    const { key, ...props } = inputProps;

    return (
        <Textarea
            id={id}
            className={error ? "border-destructive" : ""}
            {...props}
        />
    );
};