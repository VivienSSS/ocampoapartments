import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAppForm } from '@/components/ui/form'
import { pb } from '@/pocketbase'
import { insertPaymentSchema } from '@/pocketbase/schemas/payments'
import { Collections } from '@/pocketbase/types'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import type z from 'zod'
import { CreatePaymentForm } from './form'

const CreatePaymentDialogForm = () => {

    const navigate = useNavigate({ from: "/dashboard/payments" })

    const form = useAppForm({
        defaultValues: {} as z.infer<typeof insertPaymentSchema>,
        validators: {
            onChange: insertPaymentSchema
        },
        onSubmit: async ({ value }) => {

            await pb.collection(Collections.Payments).create(value)

            navigate({ to: "/dashboard/payments" })
        }
    })

    return (
        <Dialog>
            <DialogTrigger>Create Payment</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new property</DialogTitle>
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
                        <CreatePaymentForm form={form} />
                        <form.SubmitButton className='col-span-full'>Create Payment</form.SubmitButton>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePaymentDialogForm