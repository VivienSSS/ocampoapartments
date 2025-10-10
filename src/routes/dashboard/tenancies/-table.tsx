import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/tenancies' });
      const searchQuery = useSearch({ from: '/dashboard/tenancies/' })
      return <Checkbox
        checked={searchQuery.selected?.length === table.getRowModel().rows.map(row => row.original.id).length}
        onCheckedChange={(checked) => {
          if (checked) {
            navigate({
              search: (prev) => ({
                ...prev,
                selected: table.getRowModel().rows.map(row => row.original.id),
              }),
            })
          } else {
            navigate({
              search: (prev) => ({
                ...prev,
                selected: []
              }),
            })
          }
        }
        }
      />
    },
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/tenancies' });
      const searchQuery = useSearch({ from: '/dashboard/tenancies/' })

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: [...(searchQuery.selected ?? []), row.original.id],
                  }),
                })
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: (searchQuery.selected ?? []).filter((id: string) => id !== row.original.id),
                  }),
                })
              }
            }
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'expand.tenant',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant Name" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: 'unit',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.unit.expand.property.branch} - ${row.original.expand.unit.floorNumber}${row.original.expand.unit.unitLetter}`,
  },
  {
    accessorKey: 'leaseStartDate',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease Start Date" />
    ),
    cell: ({ row }) => format(row.original.leaseStartDate, 'PPP'),
  },
  {
    accessorKey: 'leaseEndDate',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease End Date" />
    ),
    cell: ({ row }) => format(row.original.leaseEndDate, 'PPP'),
  },
  {
    accessorKey: 'status',
    enableSorting: false,
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
