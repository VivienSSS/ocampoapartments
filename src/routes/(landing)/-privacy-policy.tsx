import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PrivacyPolicyDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-primary text-sm underline hover:underline-offset-2"
        >
          Privacy Policy
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Effective immediately. Last updated November 2025
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Introduction */}
          <section className="space-y-2">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              Introduction
            </h2>
            <p className="leading-7 text-muted-foreground">
              Ocampo's Apartment ("we," "our," or "us") is committed to
              protecting your privacy. This policy explains what information we
              collect from tenants and prospects, why we collect it, and how
              it's used in our apartment management system. The privacy policy
              adheres to the Data Privacy Act of 2012 and other related laws of
              the Philippines.
            </p>
          </section>

          {/* What We Collect */}
          <section className="space-y-3">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              What We Collect
            </h2>
            <p className="leading-7 text-muted-foreground">
              To provide our services, we collect the following personal
              information:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">
                  Basic personal details
                </span>{' '}
                - full names, age, contact number, and e-mail for tenant
                identification and recordkeeping;
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Email address
                </span>{' '}
                – for account setup, notices, and updates;
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Phone number
                </span>{' '}
                – for calls, texts, and urgent communication;
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Facebook account
                </span>{' '}
                – used only for login or ID verification; and
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Payment details
                </span>{' '}
                – such as GCash or other payment references used to track rent
                payments
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground mt-3">
              We only collect what is necessary to operate the service and
              manage tenant relationships. You as the user are responsible for
              the data you submit and you are to ensure the submitted data is
              correct, complete, and updated.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              How We Use Your Information
            </h2>
            <p className="leading-7 text-muted-foreground">
              Your information is used to:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>Manage resident accounts and lease records</li>
              <li>
                Communicate with the landlord about payments, maintenance, and
                announcements
              </li>
              <li>Verify your identity (including optional Facebook login)</li>
              <li>
                Process and confirm rent payments (e.g., through GCash or
                similar platforms)
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground mt-3">
              We do not sell your data or use it for marketing or third-party
              advertising.
            </p>
          </section>

          {/* Who Has Access */}
          <section className="space-y-3">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              Who Has Access
            </h2>
            <p className="leading-7 text-muted-foreground">
              We are prohibited to share your data to third parties, your data
              will only be accessed by or shared to:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>
                Authorized property management staff (the Administrator and the
                Building Administrator)
              </li>
              <li>
                System administrators and developers responsible for maintaining
                the platform
              </li>
              <li>
                Trusted service providers (e.g., hosting or SMS/email services)
                under strict confidentiality
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground mt-3">
              The service will only use the personal data for the purposes
              disclosed in this Privacy Policy and not for any ill purpose.
            </p>
          </section>

          {/* Data Security */}
          <section className="space-y-3">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              Data Security
            </h2>
            <p className="leading-7 text-muted-foreground">
              We take appropriate measures to protect your data, including
              secure access controls, and safe storage of payment records. The
              implemented are the following:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>
                Any personal data provided is processed by the system using a
                secured connection.
              </li>
              <li>
                We only restrict roles of accounts to only authenticated and
                verified personnel who are responsible in holding the data.
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="space-y-3">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              How Long Do We Keep Your Personal Data?
            </h2>
            <ul className="ml-6 space-y-2 list-disc text-muted-foreground">
              <li>
                As long as the tenant resides in the apartment, the data
                provided will be maintained until the tenant moves out;
              </li>
              <li>
                If the tenant no longer resides in the apartment but has an
                unpaid transaction, the information will be maintained for a
                period of 6 months.
              </li>
            </ul>
          </section>

          {/* Agreement */}
          <section className="pt-2 border-t">
            <p className="leading-7 text-muted-foreground">
              By using this service, you agree to the terms of this Privacy
              Policy.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
