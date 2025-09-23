import { useSuspenseQueries } from '@tanstack/react-query';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import {
  insertMaintenanceWorkerSchema,
  updateMaintenanceWorkerSchema,
} from '@/pocketbase/schemas/maintenanceWorkers';
import { Collections } from '@/pocketbase/types';

export const CreateWorkersForm = withForm({
  defaultValues: {} as z.infer<typeof insertMaintenanceWorkerSchema>,
  render: ({ form }) => {
    const [users] = useSuspenseQueries({
      queries: [
        {
          queryKey: ['maintenanceWorker'],
          queryFn: () => pb.collection(Collections.Users).getFullList(),
        },
      ],
    });

    return (
      <>
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Name"
            />
          )}
        </form.AppField>
        <form.AppField name="contactDetails">
          {(field) => (
            <field.TextAreaField className="col-span-full" label="Contact details" />
          )}
        </form.AppField>
        <form.AppField name="isAvailable">
          {(field) => (
            <field.CheckBoxField className="col-span-full" label="Is Available" />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditWorkersForm = withForm({
  defaultValues: {} as z.infer<typeof updateMaintenanceWorkerSchema>,
  render: ({ form }) => (
    <>
      <form.AppField name="name">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Name"
          />
        )}
      </form.AppField>
      <form.AppField name="contactDetails">
        {(field) => (
          <field.TextAreaField className="col-span-full" label="Contact details" />
        )}
      </form.AppField>
      <form.AppField name="isAvailable">
        {(field) => (
          <field.CheckBoxField className="col-span-full" label="Is Available" />
        )}
      </form.AppField>
    </>
  ),
});

/* render: ({ form }) => (
   <>
     <form.AppField name="name">
       {(field) => <field.TextField className="col-span-full" label="Name" />}
     </form.AppField>
     <form.AppField name="contactDetails">
       {(field) => (
         <field.TextAreaField
           className="col-span-full"
           label="Contact Details"
         />
       )}
     </form.AppField>
     <form.AppField name="isAvailable">
       {(field) => (
         <field.CheckBoxField
           className="col-span-full"
           label="Is Available?"
         />
       )}
     </form.AppField>
   </>
 ),
}); */
