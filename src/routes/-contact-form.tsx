import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppForm } from '@/components/ui/forms';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import { inquirySchema } from '@/pocketbase/schemas/inquiry';
import { Collections, InquirySubmissionTypeOptions } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import { X } from 'lucide-react';
import z from 'zod';

const MutationSchema = inquirySchema.omit({ id: true })

const ContactForm = () => {
  const { pocketbase } = useRouteContext({ from: '/' });
  const [openImageDialog, setOpenImageDialog] = useState(false);

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
          <CardContent className="grid grid-cols-4 gap-5">
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
            <div className="col-span-4 flex items-center">
              <AlertDialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" className='w-full'>
                    View QR for Payment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-xs w-96">
                  <button
                    onClick={() => setOpenImageDialog(false)}
                    className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <X />
                    <span className="sr-only">Close</span>
                  </button>
                  <div className="flex flex-col items-center justify-center gap-4 pt-4">
                    <img
                      src="/myqr.jpg"
                      alt="QR Code"
                      className="w-72 rounded-lg"
                    />
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
            <div className="col-span-4 flex flex-row items-center gap-2.5 pt-2">
              <Button type="submit" size="lg" className="w-full">
                Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </form.AppForm>
    </form>
  );
};

export default ContactForm;
