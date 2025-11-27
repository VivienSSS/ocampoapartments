import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppForm } from '@/components/ui/forms';
import {
  Collections,
  InquiriesStatusOptions,
  type Create,
} from '@/pocketbase/types';
import { useMutation } from '@tanstack/react-query';
import { CreateRecordMutationOption } from '@/pocketbase/mutation';
import { Item, ItemMedia } from '@/components/ui/item';

export const Route = createFileRoute('/(landing)/properties/$id')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const apartment = await context.pocketbase
      .collection('apartment_units')
      .getOne(params.id, {
        expand: 'property',
      });
    return { apartment };
  },
});

function RouteComponent() {
  const { apartment } = Route.useLoaderData();
  const pathParams = Route.useParams();
  const { pocketbase } = Route.useRouteContext();

  const createMutation = useMutation(
    CreateRecordMutationOption(pocketbase, Collections.Inquiries),
  );

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 18,
      email: '',
      phone: '',
      numberOfOccupants: 1,
      message: '',
      status: InquiriesStatusOptions.pending,
      unitInterested: pathParams.id,
    } as Create<'inquiries'>,
    onSubmit: async ({ value }) => createMutation.mutateAsync(value),
  });

  // Create display data from apartment record
  const unitData = {
    title: `Unit ${apartment.unitLetter}`,
    price: `₱${apartment.price}/month`,
    status: apartment.isAvailable ? 'Available' : 'Occupied',
    badge: 'Property Unit',
    description: `Apartment unit on floor ${apartment.floorNumber}. Capacity for ${apartment.capacity} occupants. Room size: ${apartment.roomSize || 'N/A'} sq ft.`,
    mainImage: apartment.image
      ? pocketbase.files.getUrl(apartment, apartment.image)
      : 'https://via.placeholder.com/800x600?text=Unit+Image',
    thumbnails:
      apartment.carouselImage && apartment.carouselImage.length > 0
        ? apartment.carouselImage.map((img: string, idx: number) => ({
            id: `carousel-${idx}`,
            alt: `Unit ${apartment.unitLetter} - Image ${idx + 1}`,
            image: pocketbase.files.getUrl(apartment, img),
          }))
        : [],
    features: [
      { id: 'occupants', label: `${apartment.capacity} Occupants`, icon: '👥' },
      { id: 'floor', label: `Floor ${apartment.floorNumber}`, icon: '🏢' },
      {
        id: 'size',
        label: `${apartment.roomSize || 'N/A'} sq. ft.`,
        icon: '📐',
      },
    ],
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/"
            className="text-sm font-medium leading-normal text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </a>
          <span className="text-sm font-medium leading-normal text-muted-foreground">
            /
          </span>
          <a
            href="/"
            className="text-sm font-medium leading-normal text-muted-foreground transition-colors hover:text-primary"
          >
            Available Units
          </a>
          <span className="text-sm font-medium leading-normal text-muted-foreground">
            /
          </span>
          <span className="text-sm font-medium leading-normal">
            Unit {apartment.unitLetter}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left Column - Images and Details */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            {/* Main Image */}
            <div className="flex flex-col gap-4">
              <div
                className="min-h-96 w-full overflow-hidden rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url("${unitData.mainImage}")` }}
              />

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
                {unitData.thumbnails.map(
                  (thumb: { id: string; image: string; alt: string }) => (
                    <div
                      key={thumb.id}
                      className="aspect-square w-full overflow-hidden rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url("${thumb.image}")` }}
                    />
                  ),
                )}
              </div>
            </div>

            {/* Details Card */}
            <Card className="border p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        {unitData.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-secondary-foreground"
                      >
                        {unitData.badge}
                      </Badge>
                    </div>
                    <h1 className="scroll-m-20 text-3xl font-black tracking-tight md:text-4xl">
                      {unitData.title}
                    </h1>
                  </div>
                  <p className="flex-shrink-0 text-3xl font-bold text-primary">
                    {unitData.price}
                  </p>
                </div>

                <p className="leading-7 text-muted-foreground">
                  {unitData.description}
                </p>

                {/* Features Grid */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    {unitData.features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <p className="text-sm font-medium">{feature.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Lease Terms & Rental Contract Card */}
            <Card className="border p-6 bg-muted/50">
              <div className="flex flex-col gap-4">
                <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
                  Lease Terms & Rental Contract
                </h2>

                <div className="space-y-4 text-sm">
                  <p className="leading-7 text-muted-foreground">
                    The landlord requires one (1) month advance rent payment,
                    two (2) months deposit, and ₱2,000 refundable deposit for
                    the water and electricity. If a potential tenant decides to
                    cancel their move-in at the last minute, all payments made,
                    including any deposits or fees, will not be refunded.
                  </p>

                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="font-bold min-w-fit">Utilities:</span>
                      <span className="text-muted-foreground">
                        Electricity and water included in rent.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold min-w-fit">Pets:</span>
                      <span className="text-muted-foreground">
                        Small pets allowed with no additional deposit.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold min-w-fit">Parking:</span>
                      <span className="text-muted-foreground">
                        (1) motorcycle only, additional is ₱500/month.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Floorplan */}
            <Item>
              <ItemMedia>
                <img src="/floorplan.png" alt="floorPlan" />
              </ItemMedia>
            </Item>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card className="border p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="flex flex-col gap-6"
                >
                  <form.AppForm>
                    <h3 className="scroll-m-20 text-2xl font-bold mb-4">
                      Interested? Send us a message!
                    </h3>

                    {/* First Name and Last Name */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <form.AppField name="firstName">
                        {(field) => (
                          <field.TextField
                            label="First Name"
                            placeholder="John"
                          />
                        )}
                      </form.AppField>
                      <form.AppField name="lastName">
                        {(field) => (
                          <field.TextField
                            label="Last Name"
                            placeholder="Doe"
                          />
                        )}
                      </form.AppField>
                    </div>

                    {/* Age and Number of Occupants */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <form.AppField name="age">
                        {(field) => (
                          <field.NumberField label="Age" placeholder="25" />
                        )}
                      </form.AppField>
                      <form.AppField name="numberOfOccupants">
                        {(field) => (
                          <field.NumberField
                            label="No. of Occupants"
                            placeholder="2"
                          />
                        )}
                      </form.AppField>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <form.AppField name="email">
                        {(field) => (
                          <field.EmailField
                            label="Email Address"
                            placeholder="you@example.com"
                          />
                        )}
                      </form.AppField>
                      <form.AppField name="phone">
                        {(field) => (
                          <field.TextField
                            label="Phone Number"
                            placeholder="(123) 456-7890"
                            type="tel"
                          />
                        )}
                      </form.AppField>
                    </div>

                    {/* Message */}
                    <form.AppField name="message">
                      {(field) => (
                        <field.TextareaField
                          label="Message / Questions"
                          placeholder="I'd like to schedule a tour..."
                        />
                      )}
                    </form.AppField>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-bold"
                    >
                      Send Inquiry
                    </Button>
                  </form.AppForm>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
