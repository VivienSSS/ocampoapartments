import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FaqDialog = () => {
  const [open, setOpen] = useState(false);

  const faqs = [
    {
      question: 'What is the application process?',
      answer:
        "Our application process is simple and straightforward. First, schedule a tour to view the available units by contacting the landlord through the given cellphone number or e-mail. Once you've selected your preferred apartment, complete the application form given by the landlord, submit the required documents, and pay the application fee. We typically process applications within 28-48 hours.",
    },
    {
      question: 'What documents do I need to apply?',
      answer:
        "You'll need to provide a valid government-issued ID, proof of income (pay stubs, employment letter, or tax returns), and rental history references.",
    },
    {
      question: 'What lease terms do you offer?',
      answer:
        'We offer flexible lease terms to accommodate your needs, including 6-month and 12-month.',
    },
    {
      question: 'Are pets allowed?',
      answer:
        'Yes, we are a pet-friendly community! We welcome both cats and dogs with some breed and size restrictions. For small pets, a maximum of five is allowed, while only one large pet is permitted. There is no additional charge for pets.',
    },
    {
      question: 'How do I submit a maintenance request?',
      answer:
        'Maintenance requests can be submitted through your online tenant account. Once a request is filed, the building administrator will review it and schedule the necessary repairs or inspections. Tenants will be notified of the progress and completion status through the same platform.',
    },
    {
      question: 'Is parking available?',
      answer:
        'Yes, we provide both covered and uncovered parking spaces; however, only motorcycles are allowed, as there are no designated areas for four-wheeled vehicles. Each unit is provided with at least one assigned parking slot, and additional spaces may be rented on a monthly basis.',
    },
    {
      question: 'Is there a curfew for tenants?',
      answer:
        'No, there is no curfew for tenants going inside or outside the building. Tenants are provided with their own keys to the apartment gate, allowing them to go out and return at any time, even late at night. However, to maintain a peaceful environment, parties, loud gatherings, and karaoke sessions are only allowed until 10:00 PM to avoid disturbing other tenants.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-primary text-sm underline hover:underline-offset-2"
        >
          FAQ
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Frequently Asked Questions</DialogTitle>
          <DialogDescription>
            Find answers to common questions about our apartment community
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};

export default FaqDialog;
