import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
  const { pocketbase } = Route.useRouteContext();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    occupants: '',
    email: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

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
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card className="border p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <h3 className="scroll-m-20 text-2xl font-bold">
                    Interested? Send us a message!
                  </h3>

                  {/* Name and Age */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="fullName"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="age"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Age
                      </label>
                      <Input
                        id="age"
                        placeholder="25"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Phone and Occupants */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        placeholder="(123) 456-7890"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="occupants"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        No. of Occupants
                      </label>
                      <Input
                        id="occupants"
                        placeholder="2"
                        type="number"
                        value={formData.occupants}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message / Questions
                    </label>
                    <Textarea
                      id="message"
                      placeholder="I'd like to schedule a tour..."
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full font-bold">
                    Send Inquiry
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
