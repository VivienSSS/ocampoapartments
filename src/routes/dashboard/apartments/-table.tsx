import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';

export const columns: ColumnDef<ApartmentUnitsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/apartments' });
      const searchQuery = useSearch({ from: '/dashboard/apartments/' });
      return (
        <Checkbox
          checked={
            searchQuery.selected.length ===
            table.getRowModel().rows.map((row) => row.original.id).length
          }
          onCheckedChange={(checked) => {
            if (checked) {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: table.getRowModel().rows.map((row) => row.original.id),
                }),
              });
            } else {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: [],
                }),
              });
            }
          }}
        />
      );
    },
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/apartments' });
      const searchQuery = useSearch({ from: '/dashboard/apartments/' });

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                searchQuery.selected.push(row.original.id);
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected,
                  }),
                });
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected.filter(
                      (id: string) => id !== row.original.id,
                    ),
                  }),
                });
              }
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'unitLetter',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Unit Letter" />
    ),
  },
  {
    accessorKey: 'floorNumber',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Floor Number" />
    ),
  },
  {
    accessorKey: 'capacity',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Capacity" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <TableColumnHeader column={column} title="Price" />,
    cell: ({ row }) =>
      new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(row.getValue('price')),
  },
  {
    accessorKey: 'property',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => row.original.expand.property.address,
  },
  {
    accessorKey: 'isAvailable',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('isAvailable') ? 'default' : 'secondary'}>
        {row.getValue('isAvailable') ? 'Available' : 'Unavailable'}
      </Badge>
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

];

