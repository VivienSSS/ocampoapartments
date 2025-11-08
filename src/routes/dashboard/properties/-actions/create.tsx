import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import { useAppForm } from '@/components/ui/forms';
import {
  createPropertyMutation,
  listPropertiesQuery,
} from '@/pocketbase/queries/properties';
import { CreatePropertyForm, CreatePropertyFormOption } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreatePropertyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const searchParams = useSearch({ from: '/dashboard/properties/' });
  const propertyMutation = useMutation(createPropertyMutation);
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

  const form = useAppForm({
    ...CreatePropertyFormOption,
    onSubmit: async ({ value }) =>
      propertyMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listPropertiesQuery(searchParams.page, searchParams.perPage),
          );
          navigate({ to: '/dashboard/properties', search: { new: undefined } });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Want to add a new apartment property?"
        description="Enter the right information"
        open={searchParams.new}
        onOpenChange={() =>
          navigate({ to: '/dashboard/properties', search: { new: undefined } })
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClear={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate({ to: '/dashboard/properties', search: { new: undefined } });
        }}
      >
        <CreatePropertyForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreatePropertyDialogForm;
