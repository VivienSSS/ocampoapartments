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
import { insertTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { CreateTenancyForm } from './form';
import { useMutation } from '@tanstack/react-query';
import {
  createTenancyMutation,
  listTenanciesQuery,
} from '@/pocketbase/queries/tenancies';

const CreateTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const search = useSearch({ from: '/dashboard/tenancies/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const mutation = useMutation(createTenancyMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertTenanciesSchema>,
    validators: {
      onChange: insertTenanciesSchema,
    },

    onSubmit: async ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listTenanciesQuery(search.page, search.perPage),
          );
          navigate({ to: '/dashboard/tenancies', search: { new: undefined } });
        },
      });
    },
  });

  return (
    <Dialog
      open={!!search.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/tenancies', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tenancy</DialogTitle>
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
            <CreateTenancyForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create Tenancy
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenancyDialogForm;
