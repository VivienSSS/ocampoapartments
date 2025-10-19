import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppForm } from '@/components/ui/form';
import {
  createPropertyMutation,
  listPropertiesQuery,
} from '@/pocketbase/queries/properties';
import { CreatePropertyForm, CreatePropertyFormOption } from './form';

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
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/properties', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new apartment property?</DialogTitle>
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
            <CreatePropertyForm form={form} />
            <form.SubmitButton className='mt-3 col-span-full'>Create Property</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyDialogForm;
