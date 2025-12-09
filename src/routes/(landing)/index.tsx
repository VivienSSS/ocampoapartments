import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PropertiesBranchOptions } from '@/pocketbase/types';

export const Route = createFileRoute('/(landing)/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const apartments = await context.pocketbase
      .collection('apartment_units')
      .getFullList(200, {
        sort: '-created',
        expand: 'property',
      });
    return { apartments };
  },
});

function RouteComponent() {
  const { apartments } = Route.useLoaderData();
  const { pocketbase } = Route.useRouteContext();
  const [branch, setBranch] = useState<PropertiesBranchOptions>(
    PropertiesBranchOptions['Quezon City'],
  );

  return (
    <>
      {/* Hero Section */}
      <section className="px-4 py-10 sm:px-6">
        <div
          className="flex min-h-[520px] flex-col items-center justify-center gap-6 rounded-xl bg-cover bg-center p-6 text-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDD8A5NhStddOAZHN3WQbQ2LBeJoGnNhzhrSHh6NmH2vmofygdK-BLSUNCG8lYXXmwJ3RDp7Ed0bfTFAK9mFd4XcC2qJ2FBxWZVCIP0reSMFN65u3wH6fZEr-c03juF6qc2bfNN0LiLGybEGJhIVA_LPBsDf1TF-d3DYhl1sHwGOIJnqchSVy8yLFS4-rbnEGDw6gzN8KcmHuL9Vqj7mpWEw9Zaxn88gTTpHRHA1Pt6osKE2vJm41nQkXAQsIjv7FFSnB50CEdLBwk")',
          }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-secondary-foreground sm:text-5xl">
              Find Your Perfect Home
            </h1>
            <p className="text-base leading-normal text-secondary-foreground/70 sm:text-lg">
              Quality living spaces in prime locations, designed for your
              comfort and convenience.
            </p>
          </div>
          <Button size="lg" className="font-bold">
            View Available Units
          </Button>
        </div>
      </section>

      {/* Properties Section */}
      <section className="px-4 py-12 sm:px-6">
        <h2 className="scroll-m-20 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Discover Our Properties
        </h2>

        {/* Filter Tabs */}
        <div className="flex justify-center px-4 py-3">
          <div className="flex h-12 w-full max-w-md items-center rounded-lg bg-muted p-1.5">
            {['Quezon City', 'Pampanga'].map((location) => (
              <label
                key={location}
                className="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all has-[:checked]:bg-background has-[:checked]:shadow-sm"
              >
                <span className="truncate">{location}</span>
                <input
                  type="radio"
                  name="location-filter"
                  value={location}
                  checked={location === 'All' ? false : branch === location}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Quezon City' || value === 'Pampanga') {
                      setBranch(value as PropertiesBranchOptions);
                    }
                  }}
                  className="invisible w-0"
                />
              </label>
            ))}
          </div>
        </div>
        {/* Properties Grid */}
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {apartments
            .filter((property) => {
              const propertyBranch = (
                property.expand as unknown as { property?: { branch?: string } }
              )?.property?.branch;
              return propertyBranch === branch;
            })
            .map((property) => (
              <Link
                key={property.id}
                to="/properties/$id"
                params={{ id: property.id }}
              >
                <div className="flex flex-col gap-3 cursor-pointer transition-opacity hover:opacity-80">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-300 hover:scale-105"
                      style={{
                        backgroundImage: property.image
                          ? `url("${pocketbase.files.getUrl(property, property.image)}")`
                          : undefined,
                      }}
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-lg font-semibold leading-normal">
                      Unit {property.unitLetter}
                    </p>
                    <p className="text-sm leading-normal text-muted-foreground">
                      {property.capacity} Occupants • ₱{property.price}/mo
                    </p>
                    <p className="text-sm font-medium leading-normal text-primary">
                      {property.isAvailable ? 'Available' : 'Occupied'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-12 sm:px-6" id="about">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div
            className="aspect-video w-full rounded-lg bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPfiuFqutuHpHRtPdZxrhazDwx9FQngc3nO2woYXjmhMEa247lUVbBHOCAUcbUlEIzEFLPLD5GPgvnuX0_mi6Hv_N5k7gB9yde6-j68zxJYkTTAxC9w9_d4tqkgAzIoLi4Aecr0IueHJDaHRC8Nhi0DBNoqu-eeHYQJH6DYXBh-HtsvNzflqqQkci9nw2cjkG7zhLf0OUvMvtH-Cv_rkqkqAvGHSVV12jS4-p7y7BwXz1lav8a7PXzBu5RosHysufrLNcHOU_WQWc")',
            }}
          />
          <div className="flex flex-col gap-4">
            <h2 className="scroll-m-20 text-2xl font-bold tracking-tight sm:text-3xl">
              About Ocampo Apartments
            </h2>
            <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
              Ocampo Apartments has been dedicated to
              providing exceptional living experiences. Our mission is to offer
              high-quality, comfortable, and secure homes in prime locations. We
              believe in building communities and ensuring our residents feel
              valued and supported. Our commitment to excellence is reflected in
              our well-maintained properties and our professional, approachable
              management team.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
