import React from "react";
import { FieldSet } from "../../field";

export const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"form">
>(({ children, ...props }, ref) => {
  return (
    <form ref={ref} className="space-y-4" {...props}>
      <FieldSet>
        {children}
      </FieldSet>
    </form>
  );
});
