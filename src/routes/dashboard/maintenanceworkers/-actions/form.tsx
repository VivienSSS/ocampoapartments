import type z from 'zod';
import { withForm } from '@/components/ui/forms';
import type {
  insertMaintenanceWorkerSchema,
  updateMaintenanceWorkerSchema,
} from '@/pocketbase/schemas/maintenanceWorkers';

export const CreateWorkersForm = withForm({
  defaultValues: {} as z.infer<typeof insertMaintenanceWorkerSchema>,
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="name">
          {(field) => (
            <field.TextField className="col-span-full" label="Name" />
          )}
        </form.AppField>
        <form.AppField name="contactDetails">
          {(field) => (
            <field.TextareaField
              className="col-span-full"
              label="Contact details"
            />
          )}
        </form.AppField>
        <form.AppField name="isAvailable">
          {(field) => <field.BoolField label="Is Available" />}
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
        {(field) => <field.TextField className="col-span-full" label="Name" />}
      </form.AppField>
      <form.AppField name="contactDetails">
        {(field) => (
          <field.TextareaField
            className="col-span-full"
            label="Contact details"
          />
        )}
      </form.AppField>
      <form.AppField name="isAvailable">
        {(field) => <field.BoolField label="Is Available" />}
      </form.AppField>
    </>
  ),
});
