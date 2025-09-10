import { withForm } from "@/components/ui/form";
import { pb } from "@/pocketbase";
import { insertApartmentUnitSchema, updateApartmentUnitSchema } from "@/pocketbase/schemas/apartmentUnits";
import { Collections } from "@/pocketbase/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import type z from "zod";

export const CreateApartmentForm = withForm({
    defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
    // validators: {
    //     onChange: insertApartmentUnitSchema
    // },
    render: function ({ form }) {

        const { data: properties } = useSuspenseQuery({ queryKey: ["properties"], queryFn: () => pb.collection(Collections.Properties).getFullList() })

        return <>
            <form.AppField name="floorNumber">
                {field => <field.TextField className="col-span-full" label="Floor number" placeholder="ex. 3" type="number" />}
            </form.AppField>
            <form.AppField name="capacity">
                {field => <field.TextField className="col-span-2" label="capacity" placeholder="ex. 8" type="number" />}
            </form.AppField>
            <form.AppField name="price">
                {field => <field.TextField className="col-span-2" label="Price" placeholder="ex. 500" type="number" />}
            </form.AppField>
            <form.AppField name="unitLetter">
                {field => <field.TextField className="col-span-full" label="Unit letter" placeholder="A" />}
            </form.AppField>
            <form.AppField name="property">
                {field => <field.SelectField className="col-span-full" options={properties.map((value) => ({ label: value.address, value: value.id }))} label="Property" placeholder="id" />}
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