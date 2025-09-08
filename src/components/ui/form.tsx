import { createFormHookContexts, createFormHook } from '@tanstack/react-form'
import TextField from './text-field'
import { Button } from './button'

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const SubmitButton = ({ ...props }: React.ComponentProps<typeof Button>) => {

  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {props.children}
        </Button>
      )}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
})