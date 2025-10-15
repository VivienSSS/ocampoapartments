import { useMutation } from '@tanstack/react-query';
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
import { createBillMutation, listBillsQuery } from '@/pocketbase/queries/bills';
import { insertBillSchema } from '@/pocketbase/schemas/bills';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';
import { insertBillItemsSchema } from '@/pocketbase/schemas/billItems';

const CreateBillingDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/billing' });
  const searchParams = useSearch({ from: '/dashboard/billing/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/billing/' });

  const billMutation = useMutation(createBillMutation);



  return (
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/billing', search: { new: undefined } })
      }
    >
      <DialogContent className="!max-h-3/4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Want to add a new billing to a tenant?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertBillSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillingDialogForm;
