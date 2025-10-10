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
    batchDeleteMaintenanceWorkerMutation,
    inMaintenanceWorkersQuery,
    listMaintenanceWorkersQuery,
} from '@/pocketbase/queries/maintenanceWorkers';

const DeleteWorkerDialogForm = () => {
    const searchQuery = useSearch({ from: '/dashboard/maintenanceworkers/' });
    const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
    const { queryClient } = useRouteContext({
        from: '/dashboard/maintenanceworkers/',
    });

    const { data: workers } = useQuery(
        {
            ...inMaintenanceWorkersQuery(searchQuery.selected),
            enabled: !!searchQuery.selected && searchQuery.delete,
        },
        queryClient,
    );

    const deleteMutation = useMutation(
        batchDeleteMaintenanceWorkerMutation(searchQuery.selected),
        queryClient,
    );

    return (
        <AlertDialog
            open={!!searchQuery.delete && !!searchQuery.selected}
            onOpenChange={() =>
                navigate({
                    search: (prev) => ({ ...prev, delete: undefined }),
                })
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure to delete {workers?.map((record) => `\`${record.name}\``).join(',')}
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
                                            selected: []
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
