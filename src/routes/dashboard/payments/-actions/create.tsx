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
  createPaymentMutation,
} from '@/pocketbase/queries/payments';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';
import { insertPaymentSchema } from '@/pocketbase/schemas/payments';

const CreatePaymentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/payments' });
  const search = useSearch({ from: '/dashboard/payments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/payments/' });

  const mutation = useMutation(createPaymentMutation);

  return (
    <Dialog
      open={!!search.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/payments', search: { new: undefined } })
      }
    >
      <DialogContent className="!max-h-3/4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Want to create a new payment?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertPaymentSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymentDialogForm;
