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
import type { BillsResponse } from '@/pocketbase/queries/bills';

export const columns: ColumnDef<BillsResponse>[] = [
  {
    accessorKey: 'tenancy',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenancy" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenancy.expand.tenant.expand.user.firstName} ${row.original.expand.tenancy.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => format(row.original.dueDate, 'PPP'),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'Paid'
              ? 'default'
              : status === 'Due'
                ? 'secondary'
                : 'destructive'
          }
        >
          {status}
        </Badge>
      );
    },
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
      const navigate = useNavigate({ from: '/dashboard/billing' });
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
              Edit Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
