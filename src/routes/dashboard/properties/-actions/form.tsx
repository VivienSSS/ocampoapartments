import { withForm } from "@/components/ui/form";
import { insertPropertySchema, updatePropertySchema } from "@/pocketbase/schemas/properties";
import type z from "zod";

export const CreatePropertyForm = withForm({
    defaultValues: {} as z.infer<typeof insertPropertySchema>,
    validators: {
        onChange: insertPropertySchema
    },
    render: function ({ form }) {
        return <>
            <form.AppField name="address">
                {field => <field.TextField placeholder="Your address" />}
            </form.AppField>
            <form.AppField name="branch">
                {field => <field.TextField placeholder="Branch Type" />}
            </form.AppField>
        </>
    }
});

export const EditPropertyForm = withForm({
    defaultValues: {} as z.infer<typeof updatePropertySchema>,
    validators: {
        onChange: updatePropertySchema
    },
    render: function ({ form }) {
        return <>
            <form.AppField name="address">
                {field => <field.TextField />}
            </form.AppField>
            <form.AppField name="branch">
                {field => <field.TextField />}
            </form.AppField>
        </>
    }
});