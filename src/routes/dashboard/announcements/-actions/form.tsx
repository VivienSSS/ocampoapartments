import { useSuspenseQueries } from "@tanstack/react-query";
import type z from "zod";
import { withForm } from "@/components/ui/form";
import { pb } from "@/pocketbase";
import {
  insertAnnouncementSchema,
  updateAnnouncementSchema,
} from "@/pocketbase/schemas/announcements";
import { Collections } from "@/pocketbase/types";

export const CreateAnnouncementForm = withForm({
  defaultValues: {} as z.infer<typeof insertAnnouncementSchema>,
  validators: {
    onChange: insertAnnouncementSchema,
  },
  render: ({ form }) => {
    const [users] = useSuspenseQueries({
      queries: [
        {
          queryKey: ["announcements"],
          queryFn: () => pb.collection(Collections.Users).getFullList(),
        },
      ],
    });

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

export const EditAnnouncementForm = withForm({
  defaultValues: {} as z.infer<typeof updateAnnouncementSchema>,
  validators: {
    onChange: updateAnnouncementSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="author">
        {(field) => (
          <field.TextField hidden className="col-span-full" label="Author" />
        )}
      </form.AppField>
      <form.AppField name="title">
        {(field) => <field.TextField className="col-span-full" label="Title" />}
      </form.AppField>
      <form.AppField name="message">
        {(field) => (
          <field.TextField className="col-span-full" label="Message" />
        )}
      </form.AppField>
    </>
  ),
});
