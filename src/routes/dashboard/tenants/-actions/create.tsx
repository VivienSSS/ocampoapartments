import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAppForm } from '@/components/ui/form'
import { pb } from '@/pocketbase'
import { insertTenantSchema } from '@/pocketbase/schemas/tenants'
import { Collections } from '@/pocketbase/types'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import type z from 'zod'
import { CreateTenantForm } from './form'

const CreateTenantDialogForm = () => {

    const navigate = useNavigate({ from: "/dashboard/tenants" })

    const form = useAppForm({
        defaultValues: {} as z.infer<typeof insertTenantSchema>,
        validators: {
            onChange: insertTenantSchema
        },

        onSubmit: async ({ value }) => {

            await pb.collection(Collections.Tenants).create(value)

            navigate({ to: "/dashboard/tenants" })

        }
    })

    return (
        <Dialog>
            <DialogTrigger>Create Tenant</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new tenant</DialogTitle>
                    <DialogDescription>Enter the right information</DialogDescription>
                </DialogHeader>
                <form
                    className='grid grid-cols-4 gap-2.5'
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit()
                    }}>
                    <form.AppForm>
                        <CreateTenantForm form={form} />
                        <form.SubmitButton className='col-span-full'>Create Tenant</form.SubmitButton>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTenantDialogForm