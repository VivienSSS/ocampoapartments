import { withForm } from "@/components/ui/form"
import { insertMaintenanceWorkerSchema, updateMaintenanceWorkerSchema } from "@/pocketbase/schemas/maintenanceWorkers"
import type z from "zod";

export const CreateWorkerForm = withForm({
    defaultValues: {} as z.infer<typeof insertMaintenanceWorkerSchema>,
    validators: {
        onChange: insertMaintenanceWorkerSchema
    },
    render: function ({ form }) {

        return <>
            <form.AppField name="name">
                {field => <field.TextField className="col-span-full" label="Name" />}
            </form.AppField>
            <form.AppField name="contactDetails">
                {field => <field.TextAreaField className="col-span-full" label="Contact Details" />}
            </form.AppField>
            <form.AppField name="isAvailable">
                {field => <field.CheckBoxField className="col-span-full" label="Is Available?" />}
            </form.AppField>

        </>
    }

});
