import { createFormHookContexts, createFormHook } from '@tanstack/react-form'
import TextField from '../field-components/text-field'
import CheckBoxField from '../field-components/checkbox-field'
import DateField from '../field-components/date-field'
import SelectField from "../field-components/select-field"
import { Button } from './button'
import TextAreaField from '../field-components/text-area-field'

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const SubmitButton = ({ ...props }: React.ComponentProps<typeof Button>) => {

  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} {...props}>
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
  fieldComponents: { TextField, CheckBoxField, DateField, SelectField, TextAreaField },
  formComponents: { SubmitButton },
})