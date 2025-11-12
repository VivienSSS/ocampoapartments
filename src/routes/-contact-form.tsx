import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppForm } from '@/components/ui/forms';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import { inquirySchema } from '@/pocketbase/schemas/inquiry';
import { Collections, InquirySubmissionTypeOptions } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';

const MutationSchema = inquirySchema.omit({ id: true })

const ContactForm = () => {
  const { pocketbase } = useRouteContext({ from: '/' });

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof MutationSchema>,
    validators: { onSubmit: MutationSchema },
    onSubmit: async ({ value }) => {
      await pocketbase.collection(Collections.Inquiry).create(value);
      toast.success(
        'Inquiry submitted successfully! We will get back to you soon.',
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <Card>
          <CardContent className="grid grid-cols-4 gap-2.5">
            <form.AppField name="firstName">
              {(field) => (
                <div className="col-span-2">
                  <field.TextField label="First name" placeholder="Juan" />
                </div>
              )}
            </form.AppField>
            <form.AppField name="lastName">
              {(field) => (
                <div className="col-span-2">
                  <field.TextField label="Last name" placeholder="Dela cruz" />
                </div>
              )}
            </form.AppField>
            <form.AppField name="age">
              {(field) => (
                <div className="col-span-1">
                  <field.NumberField label="Age" placeholder="25" />
                </div>
              )}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => (
                <field.TextField label="Phone" placeholder="+63 912 345 6789" />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <div className="col-span-2">
                  <field.TextField
                    type="email"
                    label="Email"
                    placeholder="juan@example.com"
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="message">
              {(field) => (
                <div className="col-span-4">
                  <field.TextareaField
                    label="Message"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="unitInterested">
              {(field) => (
                <div className="col-span-2">
                  <field.RelationField<ApartmentUnitsResponse>
                    label="Choose Unit"
                    // description="The apartment unit that are interested in"
                    pocketbase={pocketbase}
                    relationshipName="unit"
                    collectionName={Collections.ApartmentUnits}
                    recordListOption={{ expand: 'property' }}
                    renderOption={(item) =>
                      `${item.expand.property.branch} - ${item.floorNumber} - ${item.unitLetter}`
                    }
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="numberOfOccupants">
              {(field) => (
                <div className="col-span-2">
                  <field.NumberField
                    label="Number of Occupants"
                    placeholder="2"
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="submission_type">
              {(field) => (
                <div className="col-span-2">
                  <field.SelectField
                    label="Payment Type"
                    placeholder="Select payment type"
                    options={Object.values(InquirySubmissionTypeOptions).map(
                      (value) => ({
                        label: value,
                        value: value,
                      })
                    )}
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="qr_image_proof">
              {(field) => (
                <div className="col-span-2">
                  <field.FileField
                    label="Proof of Payment"
                  />
                </div>
              )}
            </form.AppField>
            <div className="col-span-4 flex flex-row items-center gap-2.5 pt-4">
              <Button type="submit" size="lg" className="w-full">
                Submit Inquiry
              </Button>
            </div>
          </CardContent>
        </Card>
      </form.AppForm>
    </form>
  );
};

export default ContactForm;
