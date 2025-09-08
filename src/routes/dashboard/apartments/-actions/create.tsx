import { useAppForm } from '@/components/ui/form'
import { pb } from '@/pocketbase'
import { insertApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits'
import { Collections } from '@/pocketbase/types'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import type z from 'zod'
import { CreateApartmentForm } from './form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const CreateApartmentDialogForm = () => {

    const navigate = useNavigate({ from: "/dashboard/apartments" })

    const form = useAppForm({
        defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
        // validators: {
        //     onChange: insertApartmentUnitSchema
        // },
        onSubmit: async ({ value }) => {

            await pb.collection(Collections.ApartmentUnits).create(value)

            navigate({ to: "/dashboard/apartments" })
        }
    })
    return (
        <Dialog>
            <DialogTrigger>Create Property</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new property</DialogTitle>
                    <DialogDescription>Enter the right information</DialogDescription>
                </DialogHeader>
                <form onSubmit={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit()
                }}>
                    <form.AppForm>
                        <CreateApartmentForm form={form} />
                        <form.SubmitButton>Create apartment</form.SubmitButton>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateApartmentDialogForm