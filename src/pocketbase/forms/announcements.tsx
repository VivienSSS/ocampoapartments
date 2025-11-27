import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';

export const AnnouncementForm = () =>
  withForm({
    defaultValues: {} as Update<'announcements'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="Title"
                    description="The title or subject of the announcement"
                    placeholder="Announcement Title"
                    tooltip="E.g. 'New Maintenance Schedule'"
                  />
                )}
              </form.AppField>
              <form.AppField name="message">
                {(field) => (
                  <field.TextareaField
                    label="Message"
                    description="The full content and details of the announcement"
                    placeholder="Announcement Message"
                    tooltip="E.g. 'Scheduled maintenance on April 5th from 2 AM to 4 AM'"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateAnnouncementFormOption = formOptions({
  defaultValues: {} as Create<'announcements'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('announcements')
        .create({
          ...value,
          author: meta.pocketbase.authStore.record?.id,
        } as Create<'announcements'>);

      toast.success('Announcement created successfully', {
        description: `An announcement with ID ${response.id} has been created.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});

export const UpdateAnnouncementFormOption = formOptions({
  defaultValues: {} as Update<'announcements'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('announcements')
        .update(meta.id, value);

      toast.success('Announcement updated successfully', {
        description: `An announcement with ID ${response.id} has been updated.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});
