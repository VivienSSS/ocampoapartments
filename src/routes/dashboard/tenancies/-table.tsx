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
import type { TenanciesResponse } from '@/pocketbase/queries/tenancies';

export const columns: ColumnDef<TenanciesResponse>[] = [
  {
    accessorKey: 'expand.tenant',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Apartment Unit" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.unit.expand.property.address} - ${row.original.expand.unit.unitLetter} - ${row.original.expand.unit.floorNumber}`,
  },
  {
    accessorKey: 'leaseStartDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease Start Date" />
    ),
    cell: ({ row }) => format(row.original.leaseStartDate, 'PPP'),
  },
  {
    accessorKey: 'leaseEndDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease End Date" />
    ),
    cell: ({ row }) => format(row.original.leaseEndDate, 'PPP'),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <TableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isActive = new Date(row.original.leaseEndDate) > new Date();
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
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
      const navigate = useNavigate({ from: '/dashboard/tenants' });

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
