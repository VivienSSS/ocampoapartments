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
import {
  createPropertyMutation,
  listPropertiesQuery,
} from '@/pocketbase/queries/properties';
import { AutoForm } from '@/components/ui/autoform';
import { insertPaymentSchema } from '@/pocketbase/schemas/payments';
import { ZodProvider } from '@autoform/zod';

const CreatePropertyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const searchParams = useSearch({ from: '/dashboard/properties/' });
  const propertyMutation = useMutation(createPropertyMutation);
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

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
        <AutoForm schema={new ZodProvider(insertPaymentSchema)} withSubmit />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyDialogForm;
