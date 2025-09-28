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
    cell: ({ row }) => {
      const user = row.original.expand?.tenant?.expand?.user;
      const first = user?.firstName ?? 'Unknown';
      const last = user?.lastName ?? '';
      return `${first} ${last}`.trim();
    },
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) => {
      const unit = row.original.expand?.unit;
      const letter = unit?.unitLetter ?? 'N/A';
      const floor = unit?.floorNumber ?? 'N/A';
      return `${letter} - ${floor}`;
    },
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
    cell: ({ row }) => {
      const workerName = row.original.expand?.worker?.name ?? 'Unassigned';
      return `${workerName}`;
    },
  },
  {
    accessorKey: 'submittedDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Submitted Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.submittedDate);
      return Number.isNaN(date.getTime()) ? 'N/A' : format(date, 'PPP');
    },
  },
  {
    accessorKey: 'completedDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Completed Date" />
    ),
    cell: ({ row }) => {
      if (!row.original.completedDate) return 'N/A';
      const date = new Date(row.original.completedDate);
      return Number.isNaN(date.getTime()) ? 'N/A' : format(date, 'PPP');
    },
  },
  {
    accessorKey: 'created',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created'));
      return Number.isNaN(date.getTime()) ? 'N/A' : format(date, 'PPP');
    },
  },
  {
    accessorKey: 'updated',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated'));
      return Number.isNaN(date.getTime()) ? 'N/A' : format(date, 'PPP');
    },
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

