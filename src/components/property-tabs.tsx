import { useLoaderData } from '@tanstack/react-router';
import {
  Car,
  Droplets,
  Home,
  ListStart,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Star,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';

// TypeScript interfaces for transformed data
interface PropertyGroup {
  branch: string;
  address: string;
  units: ApartmentUnitsResponse[];
}

function PropertyTabs() {
  const { availableUnits } = useLoaderData({ from: '/' });

  // Get map embed based on branch
  const getMapEmbed = (branch: string) => {
    const mapConfig = {
      'Quezon City': {
        title: 'Ocampo Apartments (Quezon City)',
        address: '406 Marine Rd, Quezon City, Metro Manila',
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.5158760598347!2d121.07149431050514!3d14.683393985753634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0ab8c170b19%3A0x472d39c3654cdc5e!2s406%20Marine%20Rd%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1759150665330!5m2!1sen!2sph',
      },
      Pampanga: {
        title: 'San Roque, Lubao (Pampanga)',
        address: 'San Roque Dau, Lubao, Pampanga',
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15417.19389590604!2d120.55953983901394!3d14.976127667928793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33965f09038b9595%3A0x355cffde76d18810!2sSan%20Roque%20Dau%2C%20Lubao%2C%20Pampanga!5e0!3m2!1sen!2sph!4v1759150591160!5m2!1sen!2sph',
      },
    };

    return mapConfig[branch as keyof typeof mapConfig] || null;
  };

  // Group units by property branch (only available units)
  const propertyGroups = useMemo(() => {
    const groups: Record<string, PropertyGroup> = {};

    availableUnits.items.forEach((unit) => {
      // Only include available units
      if (!unit.isAvailable) return;

      const branch = unit.expand?.property?.branch || 'Unknown';
      if (!groups[branch]) {
        groups[branch] = {
          branch,
          address: unit.expand?.property?.address || '',
          units: [],
        };
      }
      groups[branch].units.push(unit);
    });

    return groups;
  }, [availableUnits]);

  const branches = Object.keys(propertyGroups);
  const [activeTab, setActiveTab] = useState<string>(branches[0] || '');

  return (
    <section
      id="units"
      className="w-full bg-background py-20 flex flex-col items-center"
    >
      <div className="mb-4">
        <Badge variant="secondary" className="px-4 py-1 font-semibold">
          Featured Properties
        </Badge>
      </div>
      <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
        Discover Your Perfect Home
      </h2>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Explore our carefully curated selection of premium apartment units with
        each offering unique amenities and stunning views.
      </p>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-5xl"
      >
        <TabsList
          className={`grid w-fit h-full mx-auto grid-cols-${branches.length} mb-8`}
        >
          {branches.map((branch) => (
            <TabsTrigger
              key={branch}
              value={branch}
              className="flex flex-col items-center px-8 py-4"
            >
              <span className="font-semibold">{branch}</span>
              <span className="text-xs text-muted-foreground">
                {propertyGroups[branch].units.length} unit
                {propertyGroups[branch].units.length !== 1 ? 's' : ''} available
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {branches.map((branch) => (
          <TabsContent key={branch} value={branch} className="space-y-8">
            {/* Property Info */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">{branch} Property</CardTitle>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: propertyGroups[branch].address,
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package /> {propertyGroups[branch].units.length} available
                  unit{propertyGroups[branch].units.length !== 1 ? 's' : ''}{' '}
                  with bedframes and closets included
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Map Section */}
                {(() => {
                  const mapData = getMapEmbed(branch);
                  return mapData ? (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>{mapData.title}</CardTitle>
                        <CardDescription>{mapData.address}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="w-full h-64 md:h-96">
                          <iframe
                            title={mapData.title}
                            src={mapData.src}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })()}

                {/* Available Units */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propertyGroups[branch].units.map((unit) => (
                    <Card key={unit.id} className="overflow-hidden">
                      <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-2">
                            {unit.unitLetter}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Floor {unit.floorNumber}
                          </div>
                        </div>
                        <Badge
                          variant="default"
                          className="absolute top-4 left-4"
                        >
                          Available
                        </Badge>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Unit {unit.unitLetter}
                          </CardTitle>
                          <div className="text-right">
                            {unit.price ? (
                              <>
                                <span className="font-bold text-2xl text-card-foreground">
                                  ₱{unit.price.toLocaleString()}
                                </span>
                                <span className="text-base font-normal text-muted-foreground">
                                  /month
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Price on request
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-muted-foreground text-sm">
                          <span className="flex items-center gap-1 ">
                            <ListStart className="w-4 h-4" />
                            Floor {unit.floorNumber}
                          </span>
                          {unit.capacity && (
                            <span className="flex items-center gap-1">
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              {unit.capacity} person
                              {unit.capacity !== 1 ? 's' : ''} max
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Unit {unit.unitLetter}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {unit.floorNumber}
                            {unit.floorNumber === 1
                              ? 'st'
                              : unit.floorNumber === 2
                                ? 'nd'
                                : unit.floorNumber === 3
                                  ? 'rd'
                                  : 'th'}{' '}
                            Floor
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600"
                          >
                            Available Now
                          </Badge>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              variant="default"
                              size="lg"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Unit {unit.unitLetter} - {branch} Property
                              </DialogTitle>
                              <DialogDescription>
                                This apartment unit is eligible for a closet and
                                a bedframe ★
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Unit Overview */}
                              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Card>
                                  <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">
                                      Unit Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Unit Letter:
                                      </span>
                                      <span className="font-medium">
                                        {unit.unitLetter}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Floor:
                                      </span>
                                      <span className="font-medium">
                                        {unit.floorNumber}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Capacity:
                                      </span>
                                      <span className="font-medium">
                                        {unit.capacity || 'Not specified'}{' '}
                                        person{unit.capacity !== 1 ? 's' : ''}{' '}
                                        maximum
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Monthly Rent:
                                      </span>
                                      <span className="font-bold text-lg">
                                        {unit.price
                                          ? `₱${unit.price.toLocaleString()}`
                                          : 'Price on request'}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Amenities & Features */}
                              {/* <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                  <Package className="w-5 h-5" />
                                  Included Amenities & Features
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Home className="w-4 h-4 text-green-600" />
                                      <span>Fully furnished bedroom</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Package className="w-4 h-4 text-green-600" />
                                      <span>Bedframe and closet included</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Wifi className="w-4 h-4 text-green-600" />
                                      <span>High-speed internet ready</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Zap className="w-4 h-4 text-green-600" />
                                      <span>Electricity included</span>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Droplets className="w-4 h-4 text-green-600" />
                                      <span>Water supply included</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Shield className="w-4 h-4 text-green-600" />
                                      <span>24/7 security</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Car className="w-4 h-4 text-green-600" />
                                      <span>Parking available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-green-600" />
                                      <span>Common area access</span>
                                    </div>
                                  </div>
                                </div>
                              </div> */}

                              <Separator />

                              {/* Lease Terms */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4">
                                  Lease Terms & Rental Contract
                                </h3>
                                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                                  <div className="text-justify">
                                    The landlord requires (1) month advance rent
                                    payment, (2) months deposit, and ₱2,000
                                    refundable deposit for the water and
                                    electricity. If a potential tenant decides
                                    to cancel their move-in at the last minute,
                                    all payments made, including any deposits or
                                    fees, will not be refunded. Tenants that
                                    reside in Pampanga and paid late will have a
                                    fee of ₱250. Otherwise if not, there is no
                                    fee.{' '}
                                  </div>
                                  <div>
                                    • <strong>Utilities:</strong> Electricity
                                    and water included in rent.
                                  </div>
                                  <div>
                                    • <strong>Pets:</strong> Small pets allowed
                                    with no additional deposit.
                                  </div>
                                  <div>
                                    • <strong>Parking:</strong> (1) motorcycle
                                    only, additional is ₱500/month.
                                  </div>
                                </div>
                              </div>

                              {/* Contact Information
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Phone />
                                    <div>
                                      <div className="font-medium">Phone</div>
                                      <div className="text-sm text-muted-foreground">(+63) 9176564268</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Mail />
                                    <div>
                                      <div className="font-medium">Email</div>
                                      <div className="text-sm text-muted-foreground">arlene.ocampo@gmail.com</div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}

                              {/* Action Buttons */}
                              {/* <div className="flex gap-3 pt-4">
                                <Button className="flex-1" size="lg">
                                  Schedule Viewing
                                </Button>
                                <Button variant="outline" className="flex-1" size="lg">
                                  Contact Owner
                                </Button>
                              </div> */}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export default PropertyTabs;
