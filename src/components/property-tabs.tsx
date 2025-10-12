
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLoaderData } from "@tanstack/react-router";
import type { ApartmentUnitsResponse } from "@/pocketbase/queries/apartmentUnits";

// TypeScript interfaces for transformed data
interface PropertyGroup {
  branch: string;
  address: string;
  units: ApartmentUnitsResponse[];
}

function PropertyTabs() {
  const { availableUnits } = useLoaderData({ from: "/" })

  // Get map embed based on branch
  const getMapEmbed = (branch: string) => {
    const mapConfig = {
      "Quezon City": {
        title: "Ocampo Apartments (Quezon City)",
        address: "406 Marine Rd, Quezon City, Metro Manila",
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.5158760598347!2d121.07149431050514!3d14.683393985753634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0ab8c170b19%3A0x472d39c3654cdc5e!2s406%20Marine%20Rd%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1759150665330!5m2!1sen!2sph"
      },
      "Pampanga": {
        title: "San Roque, Lubao (Pampanga)",
        address: "San Roque Dau, Lubao, Pampanga",
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15417.19389590604!2d120.55953983901394!3d14.976127667928793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33965f09038b9595%3A0x355cffde76d18810!2sSan%20Roque%20Dau%2C%20Lubao%2C%20Pampanga!5e0!3m2!1sen!2sph!4v1759150591160!5m2!1sen!2sph"
      }
    };

    return mapConfig[branch as keyof typeof mapConfig] || null;
  };

  // Group units by property branch
  const propertyGroups = useMemo(() => {
    const groups: Record<string, PropertyGroup> = {};

    availableUnits.items.forEach(unit => {
      const branch = unit.expand?.property?.branch || 'Unknown';
      if (!groups[branch]) {
        groups[branch] = {
          branch,
          address: unit.expand?.property?.address || '',
          units: []
        };
      }
      groups[branch].units.push(unit);
    });

    return groups;
  }, [availableUnits]);

  const branches = Object.keys(propertyGroups);
  const [activeTab, setActiveTab] = useState<string>(branches[0] || "");

  return (
    <section className="w-full bg-background py-20 flex flex-col items-center">
      <div className="mb-4">
        <Badge variant="secondary" className="px-4 py-1 font-semibold">Featured Properties</Badge>
      </div>
      <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Discover Your Perfect Home</h2>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Explore our carefully curated selection of premium apartments across New York's most desirable neighborhoods, each offering unique amenities and stunning views.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl">
        <TabsList className={`grid w-fit h-full mx-auto grid-cols-${branches.length} mb-8`}>
          {branches.map((branch) => (
            <TabsTrigger key={branch} value={branch} className="flex flex-col items-center px-8 py-4">
              <span className="font-semibold">{branch}</span>
              <span className="text-xs text-muted-foreground">
                {propertyGroups[branch].units.length} unit{propertyGroups[branch].units.length !== 1 ? 's' : ''} available
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div dangerouslySetInnerHTML={{ __html: propertyGroups[branch].address }} />
                </div>
                <p className="text-muted-foreground">
                  Premium apartments with {propertyGroups[branch].units.length} available unit{propertyGroups[branch].units.length !== 1 ? 's' : ''}
                </p>
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
                          variant={unit.isAvailable ? "default" : "secondary"}
                          className="absolute top-4 left-4"
                        >
                          {unit.isAvailable ? "Available" : "Occupied"}
                        </Badge>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Unit {unit.unitLetter}</CardTitle>
                          <div className="text-right">
                            {unit.price ? (
                              <>
                                <span className="font-bold text-2xl text-card-foreground">
                                  ₱{unit.price.toLocaleString()}
                                </span>
                                <span className="text-base font-normal text-muted-foreground">/month</span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Price on request</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-muted-foreground text-sm">
                          <span className="flex items-center gap-1">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Floor {unit.floorNumber}
                          </span>
                          {unit.capacity && (
                            <span className="flex items-center gap-1">
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              {unit.capacity} person{unit.capacity !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Unit {unit.unitLetter}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {unit.floorNumber}{unit.floorNumber === 1 ? 'st' : unit.floorNumber === 2 ? 'nd' : unit.floorNumber === 3 ? 'rd' : 'th'} Floor
                          </Badge>
                          {unit.isAvailable && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Available Now
                            </Badge>
                          )}
                        </div>

                        <Button
                          className="w-full"
                          variant={unit.isAvailable ? "default" : "secondary"}
                          size="lg"
                          disabled={!unit.isAvailable}
                        >
                          {unit.isAvailable ? "View Details" : "Contact for Availability"}
                        </Button>
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