import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const InquiryForm = () =>
  withForm({
    defaultValues: {} as Update<'inquiries'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField
                    label="First Name"
                    description="The inquirer's first name"
                    placeholder="Enter First Name"
                    tooltip="E.g. 'John'"
                  />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField
                    label="Last Name"
                    description="The inquirer's last name"
                    placeholder="Enter Last Name"
                    tooltip="E.g. 'Doe'"
                  />
                )}
              </form.AppField>
              <form.AppField name="age">
                {(field) => (
                  <field.NumberField
                    label="Age"
                    description="The inquirer's age in years"
                    placeholder="Enter Age"
                    tooltip="E.g. '25'"
                  />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.EmailField
                    label="Email"
                    description="The inquirer's email address for contact"
                    placeholder="Enter Email Address"
                    tooltip="E.g. 'john@example.com'"
                  />
                )}
              </form.AppField>
              <form.AppField name="phone">
                {(field) => (
                  <field.TextField
                    label="Phone"
                    description="The inquirer's phone number for contact"
                    placeholder="Enter Phone Number"
                    tooltip="E.g. '+63 9123456789'"
                  />
                )}
              </form.AppField>
              <form.AppField name="message">
                {(field) => (
                  <field.TextareaField
                    placeholder="Enter Inquiry Message"
                    description="Detailed message and questions from the inquirer"
                    label="Message"
                    tooltip="E.g. 'I am interested in a 2-bedroom unit'"
                  />
                )}
              </form.AppField>
              <form.AppField name="numberOfOccupants">
                {(field) => (
                  <field.NumberField
                    label="Number of Occupants"
                    description="How many people will live in the unit"
                    placeholder="Enter Number"
                    tooltip="E.g. '3'"
                  />
                )}
              </form.AppField>
              <form.AppField name="status">
                {(field) => (
                  <field.SelectField
                    label="Status"
                    description="Current status of the inquiry"
                    placeholder="Select Status"
                    tooltip="E.g. 'Pending' or 'Approved'"
                    options={[
                      { label: 'Pending', value: 'pending' },
                      { label: 'Approved', value: 'approved' },
                      { label: 'Rejected', value: 'rejected' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="emailVerified">
                {(field) => (
                  <field.BoolField
                    label="Email Verified"
                    description="Whether the inquirer's email address has been verified"
                    tooltip="Check if verified"
                  />
                )}
              </form.AppField>
              <form.AppField name="verifiedAt">
                {(field) => (
                  <field.DateTimeField
                    disablePastDates
                    label="Verified At"
                    description="The date and time when the email was verified"
                    placeholder="Select Verification Date"
                    tooltip="E.g. 'April 15, 2024 10:30 AM'"
                  />
                )}
              </form.AppField>
              <form.AppField name="rejectionReason">
                {(field) => (
                  <field.TextField
                    label="Rejection Reason"
                    description="The reason why the inquiry was rejected"
                    placeholder="Enter Reason"
                    tooltip="E.g. 'No available units matching criteria'"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateInquiryFormOption = formOptions({
  defaultValues: {} as Create<'inquiries'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('inquiries')
        .create(value);

      toast.success('Inquiry created successfully', {
        description: `An inquiry with ID ${response.id} has been created.`,
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

export const UpdateInquiryFormOption = formOptions({
  defaultValues: {} as Update<'inquiries'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('inquiries')
        .update(meta.id, value);

      toast.success('Inquiry updated successfully', {
        description: `An inquiry with ID ${response.id} has been updated.`,
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
