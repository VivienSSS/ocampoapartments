import { format } from 'date-fns';
import { ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { pb } from '@/pocketbase';
import type { PaymentsResponse } from '@/pocketbase/queries/payments';

interface PaymentCardsProps {
  data: PaymentsResponse[];
}

export function PaymentCards({ data }: PaymentCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  // Limit to 3 cards per page
  const limitedData = data.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {limitedData.map((payment) => (
        <Card key={payment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {payment.expand?.tenant?.expand?.user
                    ? `${payment.expand.tenant.expand.user.firstName ?? ''} ${payment.expand.tenant.expand.user.lastName ?? ''}`.trim()
                    : (payment.expand?.tenant?.id ?? 'Unknown')}
                </CardTitle>
                <CardDescription>
                  {format(new Date(payment.paymentDate), 'PPP')}
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Badge>{payment.expand?.bill?.status}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Due Date -{' '}
                  {format(new Date(payment.expand?.bill?.dueDate), 'PPP')}
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Amount Paid
                </span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(payment.amountPaid)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <Badge variant="secondary">{payment.paymentMethod}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Transaction ID
                </span>
                <span className="font-mono text-xs">
                  {payment.transactionId}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created</span>
                <span>{format(new Date(payment.created), 'PPP')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Updated</span>
                <span>{format(new Date(payment.updated), 'PPP')}</span>
              </div>
            </div>

            {payment.screenshot && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="border-t pt-4">
                    <button className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed hover:bg-muted/50">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          View Proof
                        </span>
                      </div>
                    </button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Proof of Payment</DialogTitle>
                    <DialogDescription>{payment.screenshot}</DialogDescription>
                  </DialogHeader>
                  <ScreenshotZoomDialog
                    imageUrl={pb.files.getURL(payment, payment.screenshot)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface ScreenshotZoomDialogProps {
  imageUrl: string;
}

function ScreenshotZoomDialog({ imageUrl }: ScreenshotZoomDialogProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex justify-center overflow-auto max-h-[70vh]">
        <img
          className="rounded-md"
          style={{ transform: `scale(${zoom / 100})`, maxHeight: '70vh' }}
          src={imageUrl}
          alt="Proof of payment"
        />
      </div>
    </div>
  );
}
