import { useMutation, useQuery } from '@tanstack/react-query';
import {
    useNavigate,
    useRouteContext,
    useSearch,
} from '@tanstack/react-router';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    deleteMaintenanceWorkerMutation,
    listMaintenanceWorkersQuery,
    viewMaintenanceWorkerQuery,
} from '@/pocketbase/queries/maintenanceWorkers';

const DeleteWorkerDialogForm = () => {
    const searchQuery = useSearch({ from: '/dashboard/maintenanceworkers/' });
    const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
    const { queryClient } = useRouteContext({
        from: '/dashboard/maintenanceworkers/',
    });

    const { data: worker } = useQuery(
        {
            ...viewMaintenanceWorkerQuery(searchQuery.id ?? ''),
            enabled: !!searchQuery.id && searchQuery.delete,
        },
        queryClient,
    );

    const deleteMutation = useMutation(
        deleteMaintenanceWorkerMutation(searchQuery.id ?? ''),
        queryClient,
    );

    return (
        <AlertDialog
            open={!!searchQuery.delete && !!searchQuery.id}
            onOpenChange={() =>
                navigate({
                    search: (prev) => ({ ...prev, delete: undefined, id: undefined }),
                })
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure to delete `{worker?.name}`
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            deleteMutation.mutate(undefined, {
                                onSuccess: () => {
                                    queryClient.invalidateQueries(
                                        listMaintenanceWorkersQuery(
                                            searchQuery.page,
                                            searchQuery.perPage,
                                        ),
                                    );
                                    navigate({
                                        search: (prev) => ({
                                            ...prev,
                                            delete: undefined,
                                            id: undefined,
                                        }),
                                    });
                                },
                            })
                        }
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteWorkerDialogForm;
