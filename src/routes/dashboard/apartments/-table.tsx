import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
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
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/apartments' });

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
  {
    accessorKey: 'floorNumber',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Floor Number" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <TableColumnHeader column={column} title="Price" />,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => row.original.expand.property.address,
  },
  {
    accessorKey: 'unitLetter',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Unit Letter" />
    ),
  },
  {
    accessorKey: 'capacity',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Capacity" />
    ),
  },
];

