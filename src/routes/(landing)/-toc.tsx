import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const TOCDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-primary text-sm underline hover:underline-offset-2"
        >
          Terms of Conditions
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Conditions</DialogTitle>
          <DialogDescription>
            Effective immediately. Last updated November 2025
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* General Information */}
          <section className="space-y-2">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              General Information
            </h2>
            <p className="leading-7 text-muted-foreground">
              The data kept in this website is solely for general information
              purposes and belongs to Ocampo's Apartment. In using the website,
              you are to agree to complying with the Privacy Policy and other
              relevant laws.
            </p>
          </section>

          {/* Prohibited Actions */}
          <section className="space-y-2">
            <h2 className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight">
              Prohibited Actions and User Responsibility
            </h2>
            <p className="leading-7 text-muted-foreground">
              The enclosed information within the website is prohibited to be
              published, replicated, presented, sold, distributed, or used in
              any manner without the permission of the establishment. Any action
              taken upon the information is at the user or viewer's risk.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TOCDialog;
