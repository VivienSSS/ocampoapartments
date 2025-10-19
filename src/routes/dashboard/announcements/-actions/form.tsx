import { withForm } from '@/components/ui/form';

export const AnnouncementForm = withForm({
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="author">
          {(field) => (
            <field.TextField
              hidden
              className="col-span-full"
              placeholder="Author"
            />
          )}
        </form.AppField>
        <form.AppField name="title">
          {(field) => (
            <field.TextField className="col-span-full" label="Title" />
          )}
        </form.AppField>
        <form.AppField name="message">
          {(field) => (
            <field.TextAreaField className="col-span-full" label="Message" />
          )}
        </form.AppField>
      </>
    );
  },
});

