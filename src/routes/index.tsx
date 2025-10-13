import { createFileRoute } from '@tanstack/react-router';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { pb } from '@/pocketbase';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,

} from "@/components/ui/dialog";


import { LoginForm } from '@/components/login-form';
import PropertyTabs from '@/components/property-tabs';
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import { MapPinHouse } from 'lucide-react';


export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const availableUnits = await context.queryClient.ensureQueryData(listApartmentUnitsQuery(1, 1000))
    return { availableUnits };
  },
});



function RouteComponent() {
  // We'll render the cards in a responsive grid — no pagination or scroll controls

  // Smooth-scroll helper for in-page navigation
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Theme (dark / light) toggle state — persists to localStorage and toggles
  // the `dark` class on <html> so Tailwind dark mode works if configured.
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
    } catch (e) {
      // ignore
    }
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      // ignore (e.g., SSR or blocked storage)
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((v) => !v);

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">Ocampo Apartments</a>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-4 mr-4 items-center">

              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="text-sm ml-2 px-2 py-1 rounded hover:bg-accent/10"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '🌙' : '☀️'}
              </button>

              <a
                href="#units"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  scrollTo('units');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Properties
              </a>
              <a
                href="#about"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  scrollTo('about');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </a>

            </nav>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Login</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in to Ocampo Apartments</DialogTitle>
                  <DialogDescription>Enter your credentials to access your account.</DialogDescription>
                </DialogHeader>

                <LoginForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="pt-16" />
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
        <h1 className="text-4xl font-bold mb-6">Welcome to Ocampo Apartments</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your comfortable living space and lifetime apartment.
        </p>
        <Button variant="outline" size="lg">Contact Us</Button>
      </section>

      {/* Available Units text section (moved from hero as plain text) */}
      {/* <section id="units" className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Available Units</h2>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map((c, i) => {
              const cardClass = `h-full flex flex-col overflow-hidden`;
              const imgClass = `w-full h-40 object-cover rounded`;

              return (
                <Card key={i} className={cardClass}>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-3">
                      <a href={c.href} target="_blank" rel="noopener noreferrer">
                        <img
                          src={c.src}
                          alt={c.alt}
                          className={imgClass}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/image1.jpg'; }}
                        />
                      </a>
                    </div>
                    <p className="text-sm leading-relaxed flex-grow">{c.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section>
        <PropertyTabs />
      </section>
      <section id="about" className="py-15 px-4 bg-muted text-center">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Ocampo’s Apartment is owned by Arlene Ocampo and Jason Ocampo. They handle
          And manage the apartments. The main apartment in Quezon City was built with the goal of
          generating passive income and as preparation for retirement with another building built
          in the province of Pampanga.
        </p>
      </section>
      {/* Locations / Maps Section */}
      {/* <section id="maps" className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Our Locations</h2>
            <p className="text-muted-foreground mt-2">Find us and nearby points of interest on the map.</p>
          </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      {/* Map 1 */}
      {/* <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Ocampo Apartments (Quezon City)</CardTitle>
                <CardDescription>406 Marine Rd, Quezon City, Metro Manila</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-64 md:h-96">
                  <iframe
                    title="Ocampo Apartments - Quezon City"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.5158760598347!2d121.07149431050514!3d14.683393985753634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0ab8c170b19%3A0x472d39c3654cdc5e!2s406%20Marine%20Rd%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1759150665330!5m2!1sen!2sph"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card> */}

      {/* Map 2 */}
      {/* <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>San Roque, Lubao (Pampanga)</CardTitle>
                <CardDescription>San Roque Dau, Lubao, Pampanga</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-64 md:h-96">
                  <iframe
                    title="San Roque Dau - Lubao"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15417.19389590604!2d120.55953983901394!3d14.976127667928793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33965f09038b9595%3A0x355cffde76d18810!2sSan%20Roque%20Dau%2C%20Lubao%2C%20Pampanga!5e0!3m2!1sen!2sph!4v1759150591160!5m2!1sen!2sph"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
      <section
        id="contact"
        className="w-full bg-[#18181B] text-white py-16 px-8 flex flex-col md:flex-row justify-between items-start mt-16"
      >
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="font-bold text-2xl mb-2">Ocampo's Apartment</div>
          <div className="mb-4 text-[#F3F4F6]">
            Humble comfort embraced. <br />
            Experience the warmth of simple, cozy living in our thoughtfully <br />
            designed apartment spaces — where comfort, convenience, and  <br />
            a sense of home come together naturally.
          </div>
        </div>
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="font-bold mb-4">Contact Info</div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="20" height="20" fill="none" stroke="#F3F4F6" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.24.72 3.31a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.07.35 2.18.59 3.31.72a2 2 0 0 1 1.72 2z" /></svg>
            (+63) 9176564268
          </div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="20" height="20" fill="none" stroke="#F3F4F6" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>
            arlene.ocampo@gmail.com
          </div>
          <div className="flex items-center gap-2 mb-2">
            <MapPinHouse className='w-5 h-5' />
            406 Marine Road Veterans Village <br />
            Brgy. Holy Spirit, Quezon City<br />
            Metro Manila, Philippines
          </div>
        </div>
      </section>
      <footer className="w-full bg-[#18181B] text-[#F3F4F6] py-6 px-8 border-t border-[#23272F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            &copy; 2025 Ocampo's Apartment. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-[#F3F4F6] hover:underline text-sm">Privacy Policy</a>
            <a href="/terms-of-service" className="text-[#F3F4F6] hover:underline text-sm">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
