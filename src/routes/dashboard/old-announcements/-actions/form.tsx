import { withForm } from '@/components/ui/forms';
import {
  insertAnnouncementSchema,
  updateAnnouncementSchema,
} from '@/pocketbase/schemas/announcements';
import { Feather } from 'lucide-react';
import type z from 'zod';

export const CreateAnnouncementForm = withForm({
  defaultValues: {} as z.infer<typeof insertAnnouncementSchema>,
  validators: {
    onSubmit: insertAnnouncementSchema,
  },
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="title">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Title"
              tooltip="Enter the title of the announcement"
              description="This will be shown as the heading of the announcement"
              tooltipSide="right"
              iconAddonStart={<Feather />}
            />
          )}
        </form.AppField>
        <form.AppField name="message">
          {(field) => (
            <field.TextareaField
              className="col-span-full mt-4"
              label="Message"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const UpdateAnnouncementForm = withForm({
  defaultValues: {} as z.infer<typeof updateAnnouncementSchema>,
  validators: {
    onSubmit: updateAnnouncementSchema,
  },
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="title">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Title"
              tooltip="Enter the title of the announcement"
              description="This will be shown as the heading of the announcement"
              tooltipSide="right"
              iconAddonStart={<Feather />}
            />
          )}
        </form.AppField>
        <form.AppField name="message">
          {(field) => (
            <field.TextareaField
              className="col-span-full mt-4"
              label="Message"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
