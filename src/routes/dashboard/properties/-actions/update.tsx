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
import { useAppForm } from '@/components/ui/forms';
import {
  listPropertiesQuery,
  updatePropertyMutation,
  viewPropertiesQuery,
} from '@/pocketbase/queries/properties';
import { updatePropertySchema } from '@/pocketbase/schemas/properties';
import { EditPropertyForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const EditPropertyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const searchQuery = useSearch({ from: '/dashboard/properties/' });
  const propertyMutation = useMutation(
    updatePropertyMutation(searchQuery.id ?? ''),
  );
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

  const { data: property } = useQuery(
    {
      ...viewPropertiesQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      address: property?.address ?? '',
      branch: property?.branch ?? '',
    } as z.infer<typeof updatePropertySchema>,
    validators: {
      onSubmit: updatePropertySchema,
    },
    onSubmit: async ({ value }) =>
      propertyMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listPropertiesQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/properties',
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Edit Existing Property"
        description="Enter the right information"
        open={searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/properties',
            search: { edit: undefined, id: undefined },
          })
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClear={(e) => {
          e.stopPropagation();
          form.reset();
        }}
      >
        <EditPropertyForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditPropertyDialogForm;
