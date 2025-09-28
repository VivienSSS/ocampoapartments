import { createFileRoute } from '@tanstack/react-router';
import { pb } from '@/pocketbase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const healthCheck = await pb.health.check();
    return { healthCheck };
  },
});

function RouteComponent() {
  const { healthCheck } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
        <h1 className="text-4xl font-bold mb-6">Welcome to Ocampo Apartments</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your premier destination for comfortable and modern living spaces in the heart of the city.
        </p>
        <Button size="lg" className="mr-4">View Available Units</Button>
        <Button variant="outline" size="lg">Contact Us</Button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prime Location</CardTitle>
                <CardDescription>
                  Situated in the most convenient areas with easy access to amenities
                </CardDescription>
              </CardHeader>
              <CardContent>
                Enjoy proximity to shopping centers, schools, and public transportation.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modern Amenities</CardTitle>
                <CardDescription>
                  State-of-the-art facilities for your comfort
                </CardDescription>
              </CardHeader>
              <CardContent>
                From high-speed internet to modern appliances, we've got you covered.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Always here when you need us
                </CardDescription>
              </CardHeader>
              <CardContent>
                Our dedicated team ensures your stay is comfortable and worry-free.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Find Your New Home?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our community of satisfied residents and experience the best in modern living.
        </p>
        <Button size="lg">Schedule a Viewing</Button>
      </section>
    </div>
  );
}
