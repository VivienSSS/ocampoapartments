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
import {
    updateMaintenanceWorkerMutation,
    viewMaintenanceWorkerQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import { insertMaintenanceWorkerSchema, updateMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

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
                    <DialogTitle>Edit Worker</DialogTitle>
                    <DialogDescription>Enter the right information</DialogDescription>
                </DialogHeader>
                <AutoForm schema={new ZodProvider(updateMaintenanceWorkerSchema)} />
            </DialogContent>
        </Dialog>
    );
};

export default EditWorkerDialogForm;
