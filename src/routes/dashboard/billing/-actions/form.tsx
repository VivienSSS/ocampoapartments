import { withForm } from "@/components/ui/form";
import { insertBillSchema, updateBillSchema } from "@/pocketbase/schemas/bills";
import type z from "zod";

export const CreateBillingForm = withForm({
    defaultValues: {} as z.infer<typeof insertBillSchema>,
    validators: {
        onChange: insertBillSchema
    },
    render: function ({ form }) {
        return <>
            <form.AppField name="tenancy">
                {field => <field.TextField placeholder="..." />}
            </form.AppField>
            <form.AppField name="dueDate">
                {field => <field.TextField placeholder="..." />}
            </form.AppField>
            <form.AppField name="status">
                {field => <field.TextField placeholder="..." />}
            </form.AppField>
        </>
    }
});

export const EditBillingForm = withForm({
    defaultValues: {} as z.infer<typeof updateBillSchema>,
    validators: {
        onChange: updateBillSchema
    },
    render: function ({ form }) {
        return <>
            <form.AppField name="tenancy">
                {field => <field.TextField />}
            </form.AppField>
            <form.AppField name="dueDate">
                {field => <field.TextField />}
            </form.AppField>
            <form.AppField name="status">
                {field => <field.TextField />}
            </form.AppField>
        </>
    }
});