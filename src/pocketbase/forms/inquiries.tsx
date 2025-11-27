import { withForm } from '@/components/ui/forms';
import type { Update } from '../types';

export const InquiryForm = () =>
  withForm({
    defaultValues: {} as Update<'inquiries'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="firstName">
            {(field) => (
              <field.TextField
                label="First Name"
                placeholder="Enter First Name"
                tooltip="Inquirer's first name"
              />
            )}
          </form.AppField>
          <form.AppField name="lastName">
            {(field) => (
              <field.TextField
                label="Last Name"
                placeholder="Enter Last Name"
                tooltip="Inquirer's last name"
              />
            )}
          </form.AppField>
          <form.AppField name="age">
            {(field) => (
              <field.NumberField
                label="Age"
                placeholder="Enter Age"
                tooltip="Inquirer's age"
              />
            )}
          </form.AppField>
          <form.AppField name="email">
            {(field) => (
              <field.EmailField
                label="Email"
                placeholder="Enter Email Address"
                tooltip="Contact email address"
              />
            )}
          </form.AppField>
          <form.AppField name="phone">
            {(field) => (
              <field.TextField
                label="Phone"
                placeholder="Enter Phone Number"
                tooltip="Contact phone number"
              />
            )}
          </form.AppField>
          <form.AppField name="message">
            {(field) => (
              <field.RichEditorField
                label="Message"
                tooltip="Details about the inquiry"
              />
            )}
          </form.AppField>
          <form.AppField name="numberOfOccupants">
            {(field) => (
              <field.NumberField
                label="Number of Occupants"
                placeholder="Enter Number"
                tooltip="How many people will occupy the unit"
              />
            )}
          </form.AppField>
          <form.AppField name="hasSent">
            {(field) => (
              <field.BoolField
                label="Has Sent"
                tooltip="Whether response has been sent"
              />
            )}
          </form.AppField>
          <form.AppField name="status">
            {(field) => (
              <field.SelectField
                label="Status"
                placeholder="Select Status"
                tooltip="Status of the inquiry"
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Accepted', value: 'accepted' },
                  { label: 'Rejected', value: 'rejected' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="emailVerified">
            {(field) => (
              <field.BoolField
                label="Email Verified"
                tooltip="Whether email has been verified"
              />
            )}
          </form.AppField>
          <form.AppField name="verifiedAt">
            {(field) => (
              <field.DateTimeField
                label="Verified At"
                placeholder="Select Verification Date"
                tooltip="When email was verified"
              />
            )}
          </form.AppField>
          <form.AppField name="rejectionReason">
            {(field) => (
              <field.TextField
                label="Rejection Reason"
                placeholder="Enter Reason"
                tooltip="If rejected, reason for rejection"
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
