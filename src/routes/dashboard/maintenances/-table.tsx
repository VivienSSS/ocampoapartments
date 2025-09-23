import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { MaintenanceRequestsResponse } from '@/pocketbase/queries/maintenanceRequests';

export const columns: ColumnDef<MaintenanceRequestsResponse>[] = [
  {
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/maintenances' });

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
    accessorKey: 'tenant',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.firstName}`,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) =>
      `${row.original.expand.unit.unitLetter} - ${row.original.expand.unit.floorNumber}`,
  },
  {
    accessorKey: 'urgency',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Urgency" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'worker',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Worker" />
    ),
    cell: ({ row }) => `${row.original.expand.worker.name}`,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'submittedDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Submitted Date" />
    ),
    cell: ({ row }) => format(row.original.submittedDate, 'PPP'),
  },
  {
    accessorKey: 'completedDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Completed Date" />
    ),
    cell: ({ row }) => format(row.original.completedDate, 'PPP'),
  },
];

