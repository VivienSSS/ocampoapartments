import { withForm } from '@/components/ui/forms';
import type { Update } from '../types';

export const AnnouncementForm = () =>
  withForm({
    defaultValues: {} as Update<'announcements'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="title">
            {(field) => (
              <field.TextField
                label="Title"
                placeholder="Announcement Title"
                tooltip="E.g. 'New Maintenance Schedule'"
              />
            )}
          </form.AppField>
          <form.AppField name="message">
            {(field) => (
              <field.TextareaField
                label="Message"
                placeholder="Announcement Message"
                tooltip="E.g. 'Scheduled maintenance on April 5th from 2 AM to 4 AM'"
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
