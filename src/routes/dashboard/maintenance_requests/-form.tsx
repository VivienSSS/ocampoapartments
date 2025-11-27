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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useAppForm } from '@/components/ui/forms';
import { FormOptions } from '@/pocketbase/forms';
import { BatchDeleteRecordMutationOption } from '@/pocketbase/mutation';
import { ViewQueryOption } from '@/pocketbase/query';
import { Collections } from '@/pocketbase/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useRouteContext } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';

const MaintenanceRequestForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/maintenance_requests/' });
  const navigate = useNavigate({ from: '/dashboard/maintenance_requests' });
  const { pocketbase } = useRouteContext({
    from: '/dashboard/maintenance_requests/',
  });

  // data fetching
  const { data: record } = useQuery(
    ViewQueryOption(
      pocketbase,
      Collections.MaintenanceRequests,
      searchQuery.selected?.[0],
    ),
  );

  const { formOption, Component } =
    FormOptions(
      'maintenance_requests',
      searchQuery.action === 'update' ? 'update' : 'create',
    ) || {};

  const form = useAppForm({
    ...formOption,
    defaultValues: searchQuery.action === 'update' ? record : {},
  } as any);

  // delete
  const deleteMutation = useMutation(
    BatchDeleteRecordMutationOption(
      pocketbase,
      Collections.MaintenanceRequests,
    ),
  );

  if (searchQuery.action === 'delete') {
    return (
      <AlertDialog
        open={true}
        onOpenChange={() =>
          navigate({
            search: (prev) => ({ ...prev, action: undefined, selected: [] }),
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMutation.mutate({ ids: searchQuery.selected || [] })
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog
      open={!!searchQuery.action}
      onOpenChange={() => {
        navigate({
          search: (prev) => ({
            ...prev,
            action: undefined,
          }),
        });
      }}
    >
      <DialogContent className="max-h-3/4 overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit({
              pocketbase,
              id: searchQuery.selected?.[0],
              navigate,
            });
          }}
        >
          <form.AppForm>
            <Component
              record={record}
              form={form as any}
              action={searchQuery.action === 'create' ? 'create' : 'update'}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceRequestForm;
