import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { LoginForm } from '../login-form';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b px-6 py-4 sm:px-10">
        <div className="flex items-center gap-4">
          <div className="size-6 text-primary" title="Ocampo Apartments Logo">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Ocampo Apartments Logo"
            >
              <title>Ocampo Apartments Logo</title>
              <path
                d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">
            Ocampo Apartments
          </h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-medium leading-normal transition-colors hover:text-primary"
          >
            Home
          </a>
          <a
            href="/properties"
            className="text-sm font-medium leading-normal transition-colors hover:text-primary"
          >
            Properties
          </a>
          <a
            href="/#about"
            className="text-sm font-medium leading-normal transition-colors hover:text-primary"
          >
            About Us
          </a>
          <a
            href="/#contact"
            className="text-sm font-medium leading-normal transition-colors hover:text-primary"
          >
            Contact
          </a>
          <Dialog>
            <DialogTrigger>
              <Button className="font-bold">Login</Button>
            </DialogTrigger>
            <DialogContent>
              <LoginForm />
            </DialogContent>
          </Dialog>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-accent md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div
                  className="size-5 text-primary"
                  title="Ocampo Apartments Logo"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Ocampo Apartments Logo"
                  >
                    <title>Ocampo Apartments Logo</title>
                    <path
                      d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Ocampo Apartments</h3>
              </div>
              <p className="mt-4 text-sm">
                Your partner in finding the perfect place to call home. Quality
                living made accessible.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="/" className="transition-colors hover:text-primary">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/properties"
                    className="transition-colors hover:text-primary"
                  >
                    Properties
                  </a>
                </li>
                <li>
                  <a
                    href="/#about"
                    className="transition-colors hover:text-primary"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    className="transition-colors hover:text-primary"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contact Us</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>123 Property Ave, Quezon City</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>(02) 8123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>inquire@ocampoapts.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm">
            <p>© 2024 Ocampo Apartments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
