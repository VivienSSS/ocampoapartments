import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { MaintenanceWorkersResponse } from '@/pocketbase/types';
import { useNavigate } from '@tanstack/react-router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<MaintenanceWorkersResponse>[] = [
  {
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });

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
    accessorKey: 'name',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'contactDetails',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Contact Details" />
    ),
  },
  {
    accessorKey: 'isAvailable',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Availability" />
    ),
  },
];
