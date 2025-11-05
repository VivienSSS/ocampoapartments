import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { PaymentsResponse } from '@/pocketbase/queries/payments';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { pb } from '@/pocketbase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


export const columns: ColumnDef<PaymentsResponse>[] = [
  {
    accessorKey: 'bill',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Bill Status" />,
    cell: ({ row }) => <Tooltip>
      <TooltipTrigger>{row.original.expand.bill.status}</TooltipTrigger>
      <TooltipContent>
        Due Date - {format(row.original.expand.bill.dueDate, 'PPP')}
      </TooltipContent>
    </Tooltip>
  },
  {
    accessorKey: 'tenant',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
    cell: ({ row }) => {
      const tenant = row.original.expand.tenant;
      // Prefer the tenant.facebookName, otherwise try the linked user first/last name,
      // otherwise fall back to the tenant id or 'Unknown'.
      const user = tenant?.expand?.user;
      const first = user?.firstName ?? '';
      const last = user?.lastName ?? '';
      const userFull = `${first} ${last}`.trim();
      return (userFull || tenant?.id) ?? 'Unknown';
    },
  },
  {
    accessorKey: 'amountPaid',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Amount Paid" />
    ),
    cell: ({ row }) =>
      new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(row.getValue('amountPaid')),
  },
  {
    accessorKey: 'paymentMethod',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => <Badge>{row.getValue('paymentMethod')}</Badge>,
  },
  {
    accessorKey: 'paymentDate',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('paymentDate')), 'PPP'),
  },
  {
    accessorKey: 'transactionId',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Transaction ID" />
    ),
  },
  {
    accessorKey: 'screenshot',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Screenshot" />
    ),
    cell: ({ row }) => {
      const [zoom, setZoom] = useState(100);

      const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
      const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

      return <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Proof</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proof of Payment</DialogTitle>
            <DialogDescription>{row.original.screenshot}</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2 justify-center'>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className='w-4 h-4' />
              </Button>
              <span className='text-sm font-medium px-3 py-1 bg-muted rounded'>
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className='w-4 h-4' />
              </Button>
            </div>
            <div className='flex justify-center overflow-auto max-h-[70vh]'>
              <img
                className='rounded-md'
                style={{ transform: `scale(${zoom / 100})`, maxHeight: '70vh' }}
                src={pb.files.getURL(row.original, row.original.screenshot)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    },
  },
  {
    accessorKey: 'created',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('created')), 'PPP'),
  },
  {
    accessorKey: 'updated',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('updated')), 'PPP'),
  },
];
