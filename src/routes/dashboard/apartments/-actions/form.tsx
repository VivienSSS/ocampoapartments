import { withForm } from "@/components/ui/form";
import { insertApartmentUnitSchema, updateApartmentUnitSchema } from "@/pocketbase/schemas/apartmentUnits";
import type z from "zod";

export const CreateApartmentForm = withForm({
    defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
    // validators: {
    //     onChange: insertApartmentUnitSchema
    // },
    render: function ({ form }) {
        return <>
            <form.AppField name="capacity">
                {field => <field.TextField label="capacity" placeholder="ex. 8" />}
            </form.AppField>
            <form.AppField name="floorNumber">
                {field => <field.TextField label="Floor number" placeholder="ex. 3" />}
            </form.AppField>
            <form.AppField name="price">
                {field => <field.TextField label="Price" placeholder="ex. 500" />}
            </form.AppField>
            <form.AppField name="property">
                {field => <field.TextField label="Property" placeholder="id" />}
            </form.AppField>
            <form.AppField name="unitLetter">
                {field => <field.TextField label="Unit letter" placeholder="A" />}
            </form.AppField>
        </>
    }

});

export const EditApartmentForm = withForm({
    defaultValues: {} as z.infer<typeof updateApartmentUnitSchema>,
    validators: {
        onChange: updateApartmentUnitSchema
    },
    render: function ({ form }) {
        return <>
            <form.AppField name="capacity">
                {field => <field.TextField placeholder="ex. 8" />}
            </form.AppField>
            <form.AppField name="floorNumber">
                {field => <field.TextField placeholder="ex. 3" />}
            </form.AppField>
            <form.AppField name="price">
                {field => <field.TextField placeholder="ex. 500" />}
            </form.AppField>
            <form.AppField name="property">
                {field => <field.TextField placeholder="id" />}
            </form.AppField>
            <form.AppField name="unitLetter">
                {field => <field.TextField placeholder="A" />}
            </form.AppField>
        </>
    }

});