import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { PaymentsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<PaymentsResponse>[] = [
  {
    accessorKey: 'bill',
    header: ({ column }) => <TableColumnHeader column={column} title="Bill" />,
  },
  {
    accessorKey: 'tenant',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
  },
  {
    accessorKey: 'amountPaid',
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
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => <Badge>{row.getValue('paymentMethod')}</Badge>,
  },
  {
    accessorKey: 'paymentDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('paymentDate')), 'PPP'),
  },
  {
    accessorKey: 'transactionId',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Transaction ID" />
    ),
  },
  {
    accessorKey: 'screenshot',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Screenshot" />
    ),
  },
  {
    accessorKey: 'created',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('created')), 'PPP'),
  },
  {
    accessorKey: 'updated',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('updated')), 'PPP'),
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/payments' });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    id: row.original.id,
                    edit: true,
                  }),
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    id: row.original.id,
                    delete: true,
                  }),
                })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
