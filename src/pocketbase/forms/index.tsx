import {
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { schemaToForm } from '../utils/form';
import AutoFieldSet from '@/components/ui/autoform';
import { useAppForm } from '@/components/ui/forms';
import { ClientResponseError, type RecordModel } from 'pocketbase';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  BatchDeleteRecordMutationOption,
  CreateRecordMutationOption,
  DeleteRecordMutationOption,
  UpdateRecordMutationOption,
} from '../mutation';
import { ListQueryOption, ViewQueryOption } from '../query';
import { Button } from '@/components/ui/button';
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
import { Collections, FormsOperationOptions } from '../types';

const PocketbaseForms = () => {
  const pathParams = useParams({ from: '/dashboard/$collection' });
  const searchQuery = useSearch({ from: '/dashboard/$collection' });
  const navigate = useNavigate({ from: '/dashboard/$collection' });
  const { pocketbase } = useRouteContext({ from: '/dashboard/$collection' });

  // data fetching
  const { data: record } = useQuery(
    ViewQueryOption(
      pocketbase,
      pathParams.collection as any,
      searchQuery.selected?.[0],
    ),
  );

  const { data: formSchema } = useSuspenseQuery(
    ListQueryOption(pocketbase, {
      collection: Collections.Forms,
      page: 1,
      perPage: 1000,
      options: {},
    }),
  );

  // create
  const createMutation = useMutation(
    CreateRecordMutationOption(pocketbase, pathParams.collection as any),
  );

  // update
  const updateMutation = useMutation(
    UpdateRecordMutationOption(pocketbase, pathParams.collection as any),
  );

  // delete
  const deleteMutation = useMutation(
    BatchDeleteRecordMutationOption(pocketbase, pathParams.collection as any),
  );

  const form = useAppForm({
    defaultValues: record || ({} as RecordModel),
    onSubmit: async ({ value, formApi }) => {
      try {
        if (searchQuery.action === 'update' && searchQuery.selected?.[0]) {
          await updateMutation.mutateAsync({
            id: searchQuery.selected[0],
            data: value,
          });
        } else if (searchQuery.action === 'create') {
          await createMutation.mutateAsync(value);
        }
      } finally {
        formApi.reset();
        navigate({
          search: (prev) => ({ ...prev, action: undefined, id: undefined }),
        });
      }
    },
  });

  if (searchQuery.action === 'delete' && searchQuery.selected) {
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
      open={!!searchQuery.action && searchQuery.action !== 'delete'}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, action: undefined, selected: [] }),
        })
      }
    >
      <DialogContent
        className="max-h-3/4 overflow-y-auto"
        showCloseButton={false}
      >
        <form
          encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <AutoFieldSet
              form={form}
              schema={schemaToForm(
                pathParams.collection,
                formSchema.items,
                searchQuery.action === 'create'
                  ? FormsOperationOptions.create
                  : FormsOperationOptions.update,
              )}
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

export default PocketbaseForms;
