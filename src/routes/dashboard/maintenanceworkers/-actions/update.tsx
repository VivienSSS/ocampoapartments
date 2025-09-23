import { useMutation, useQuery } from '@tanstack/react-query';
import {
    useNavigate,
    useRouteContext,
    useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAppForm } from '@/components/ui/form';
import {
    createMaintenanceWorkerMutation,
    listMaintenanceWorkersQuery,
    updateMaintenanceWorkerMutation,
    viewMaintenanceWorkerQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import { insertMaintenanceWorkerSchema, updateMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { CreateWorkersForm, EditWorkersForm } from './form';

const EditWorkerDialogForm = () => {
    const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
    const searchParams = useSearch({ from: '/dashboard/maintenanceworkers/' });
    const { queryClient } = useRouteContext({
        from: '/dashboard/maintenanceworkers/',
    });

    const maintenanceWorkerMutation = useMutation(updateMaintenanceWorkerMutation(searchParams.id ?? ''));

    const { data: worker } = useQuery({
        ...viewMaintenanceWorkerQuery(searchParams.id ?? ''),
        enabled: searchParams.new && !!searchParams.id
    }, queryClient)

    const form = useAppForm({
        defaultValues: {
            name: worker?.name,
            contactDetails: worker?.contactDetails,
            isAvailable: worker?.isAvailable,
        } as z.infer<typeof updateMaintenanceWorkerSchema>,
        onSubmit: async ({ value }) =>
            maintenanceWorkerMutation.mutateAsync(value, {
                onSuccess: () => {
                    queryClient.invalidateQueries(
                        listMaintenanceWorkersQuery(searchParams.page, searchParams.perPage),
                    );
                    navigate({
                        to: '/dashboard/maintenanceworkers',
                        search: { edit: undefined, id: undefined },
                    });
                },
            }),
    });

    return (
        <Dialog
            open={searchParams.edit}
            onOpenChange={() =>
                navigate({
                    to: '/dashboard/maintenanceworkers',
                    search: { edit: undefined, id: undefined },
                })
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new announcement</DialogTitle>
                    <DialogDescription>Enter the right information</DialogDescription>
                </DialogHeader>
                <form
                    className="grid grid-cols-4 gap-2.5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.AppForm>
                        <EditWorkersForm form={form} />
                        <form.SubmitButton className="col-span-full">
                            Update worker
                        </form.SubmitButton>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditWorkerDialogForm;
