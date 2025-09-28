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
import type { MaintenanceRequestsResponse } from '@/pocketbase/queries/maintenanceRequests';

export const columns: ColumnDef<MaintenanceRequestsResponse>[] = [
  {
    accessorKey: 'tenant',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) =>
      `${row.original.expand.unit.unitLetter} - ${row.original.expand.unit.floorNumber}`,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="truncate w-32">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'urgency',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Urgency" />
    ),
    cell: ({ row }) => {
      const urgency = row.getValue('urgency') as string;
      return (
        <Badge
          variant={
            urgency === 'Urgent'
              ? 'destructive'
              : urgency === 'Normal'
                ? 'secondary'
                : 'default'
          }
        >
          {urgency}
        </Badge>
      );
    },
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
            status === 'Completed'
              ? 'default'
              : status === 'Acknowledged'
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
    accessorKey: 'worker',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Worker" />
    ),
    cell: ({ row }) => `${row.original.expand.worker.name}`,
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
    cell: ({ row }) =>
      row.original.completedDate
        ? format(row.original.completedDate, 'PPP')
        : 'N/A',
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
];

