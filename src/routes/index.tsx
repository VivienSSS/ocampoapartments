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
import { MapPinHouse, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


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
      <section className="relative py-20 px-4 text-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("sample.jpg")' }}>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Ocampo Apartments</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Your comfortable living space and lifetime apartment.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollTo('contact')}
          >
            Contact Us
          </Button>
        </div>
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
        className="w-full bg-sidebar-primary text-sidebar-primary-foreground py-16 px-8 flex flex-col md:flex-row justify-between items-start mt-16"
      >
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="font-bold text-2xl mb-2 text-sidebar-primary-foreground">Ocampo's Apartment</div>
          <div className="mb-4 text-sidebar-primary-foreground">
            Humble comfort embraced. <br />
            Experience the warmth of simple, cozy living in our thoughtfully <br />
            designed apartment spaces — where comfort, convenience, and  <br />
            a sense of home come together naturally.
          </div>
        </div>
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="font-bold mb-4">Contact Info</div>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-sidebar-primary-foreground" />
            (+63) 9176564268
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-sidebar-primary-foreground" />
            arlene.ocampo@gmail.com
          </div>
          <div className="flex items-center gap-2 mb-2">
            <MapPinHouse className="w-5 h-5 text-sidebar-primary-foreground" />
            406 Marine Road Veterans Village <br />
            Brgy. Holy Spirit, Quezon City<br />
            Metro Manila, Philippines
          </div>
        </div>
      </section>
      <footer className="w-full bg-background text-foreground py-6 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            &copy; 2025 Ocampo's Apartment. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-foreground hover:underline text-sm cursor-pointer">
                  Privacy Policy
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Privacy Policy
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Last updated: October 20, 2025
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      Introduction
                    </h3>
                    <p className="text-sm leading-6 text-justify">
                      Ocampo's Apartment ("we," "our," or "us") is committed to protecting your privacy. This policy explains what information we collect from tenants and prospects, why we collect it, and how it's used in our apartment management system. The privacy policy adheres to the Data Privacy Act of 2012 and other related laws of the Philippines.
                    </p>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      What We Collect
                    </h3>
                    <p className="text-sm leading-6 mb-3 text-justify">
                      To provide our services, we collect the following personal information:
                    </p>
                    <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">
                      <li>Basic personal details - full names, age, contact number, and e-mail for tenant identification and recordkeeping;</li>
                      <li>Email address – for account setup, notices, and updates;</li>
                      <li>Phone number – for calls, texts, and urgent communication;</li>
                      <li>Facebook account – used only for login or ID verification; and</li>
                      <li>Payment details – such as GCash or other payment references used to track rent payments</li>
                    </ul>
                    <p className="text-sm leading-6 text-justify">
                      We only collect what is necessary to operate the service and manage tenant relationships. You as the user are responsible for the data you submit and you are to ensure the submitted data is correct, complete, and updated.
                    </p>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      How We Use Your Information
                    </h3>
                    <p className="text-sm leading-6 mb-3 text-justify">
                      Your information is used to:
                    </p>
                    <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">
                      <li>Manage resident accounts and lease records</li>
                      <li>Communicate with the landlord about payments, maintenance, and announcements</li>
                      <li>Verify your identity (including optional Facebook login)</li>
                      <li>Process and confirm rent payments (e.g., through GCash or similar platforms)</li>
                    </ul>
                    <p className="text-sm leading-6 text-justify">
                      We do not sell your data or use it for marketing or third-party advertising.
                    </p>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      Who Has Access
                    </h3>
                    <p className="text-sm leading-6 mb-3 text-justify">
                      We are prohibited to share your data to third parties, your data will only be accessed by or shared to:
                    </p>
                    <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">
                      <li>Authorized property management staff (the Administrator and the Building Administrator)</li>
                      <li>System administrators and developers responsible for maintaining the platform</li>
                      <li>Trusted service providers (e.g., hosting or SMS/email services) under strict confidentiality</li>
                    </ul>
                    <p className="text-sm leading-6 text-justify">
                      The service will only use the personal data for the purposes disclosed in this Privacy Policy and not for any ill purpose.
                    </p>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      Data Security
                    </h3>
                    <p className="text-sm leading-6 mb-3 text-justify">
                      We take appropriate measures to protect your data, including secure access controls, and safe storage of payment records. The implemented are the following:
                    </p>
                    <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">
                      <li>Any personal data provided is processed by the system using a secured connection.</li>
                      <li>We only restrict roles of accounts to only authenticated and verified personnel who are responsible in holding the data.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      How long do we keep your personal data?
                    </h3>
                    <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">
                      <li>As long as the tenant resides in the apartment, the data provided will be maintained until the tenant moves out;</li>
                      <li>If the tenant no longer resides in the apartment but has an unpaid transaction, the information will be maintained for a period of 6 months.</li>
                    </ul>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm leading-6 font-medium text-justify">
                      By using this service, you agree to the terms of this Privacy Policy.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-foreground hover:underline text-sm cursor-pointer">
                  Terms of Service
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Terms of Service
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Last updated: October 20, 2025
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm leading-6 mb-3 text-justify">
                      The data kept in this website is solely for general information purposes and belongs to Ocampo's Apartment. In using the website, you are to agree to complying with the Privacy Policy and other relevant laws.
                    </p>
                    <p className="text-sm leading-6 text-justify">
                      The enclosed information within the website is prohibited to be published, replicated, presented, sold, distributed, or used in any manner without the permission of the establishment. Any action taken upon the information is at the user or viewer's risk.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-foreground hover:underline text-sm cursor-pointer">
                  FAQs
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    FAQs
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Frequently Asked Questions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-6">
                  <div>
                    <h4 className="font-semibold mb-1">What is the application process?</h4>
                    <p className="text-justify">
                      Our application process is simple and straightforward. First, schedule a tour to view the available units by contacting the landlord through the given cellphone number or e-mail. Once you've selected your preferred apartment, complete the application form given by the landlord, submit the required documents, and pay the application fee. We typically process applications within 28-48 hours.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">What documents do i need to apply?</h4>
                    <p className="text-justify">
                      You'll need to provide a valid government-issued ID, proof of income (pay stubs, employment letter, or tax returns), and rental history references.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">What lease terms do you offer?</h4>
                    <p className="text-justify">
                      We offer flexible lease terms to accommodate your needs, including 6-month and 12-month.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Are pets allowed?</h4>
                    <p className="text-justify">
                      Yes, we are a pet-friendly community! We welcome both cats and dogs with some breed and size restrictions. For small pets, a maximum of five is allowed, while only one large pet is permitted. There is no additional charge for pets.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">How do I submit a maintenance request?</h4>
                    <p className="text-justify">
                      Maintenance requests can be submitted through your online tenant account. Once a request is filed, the building administrator will review it and schedule the necessary repairs or inspections. Tenants will be notified of the progress and completion status through the same platform.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Is parking available?</h4>
                    <p className="text-justify">
                      Yes, we provide both covered and uncovered parking spaces; however, only motorcycles are allowed, as there are no designated areas for four-wheeled vehicles. Each unit is provided with at least one assigned parking slot, and additional spaces may be rented on a monthly basis.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Is there a curfew for tenants?</h4>
                    <p className="text-justify">
                      No, there is no curfew for tenants going inside or outside the building. Tenants are provided with their own keys to the apartment gate, allowing them to go out and return at any time, even late at night. However, to maintain a peaceful environment, parties, loud gatherings, and karaoke sessions are only allowed until 10:00 PM to avoid disturbing other tenants.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </footer>
    </div>
  );
}
