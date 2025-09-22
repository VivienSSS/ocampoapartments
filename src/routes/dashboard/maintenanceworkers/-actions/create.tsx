import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAppForm } from '@/components/ui/form'
import { pb } from '@/pocketbase'
import { insertMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers'
import { Collections } from '@/pocketbase/types'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import type z from 'zod'
import { CreateWorkerForm } from './form'

const CreateWorkerDialogForm = () => {

    const navigate = useNavigate({ from: "/dashboard/maintenanceworkers" })

    const form = useAppForm({
        defaultValues: {} as z.infer<typeof insertMaintenanceWorkerSchema>,
        validators: {
            onChange: insertMaintenanceWorkerSchema
        },
        onSubmit: async ({ value }) => {

            await pb.collection(Collections.MaintenanceWorkers).create(value) // if error, will not continue below

            navigate({ to: "/dashboard/maintenanceworkers" })
        }
    })

    return (
        <Dialog>
            <DialogTrigger>Create Worker</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new worker</DialogTitle>
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
                        <CreateWorkerForm form={form} />
                        <form.SubmitButton className='col-span-full'>Create worker</form.SubmitButton>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkerDialogForm

