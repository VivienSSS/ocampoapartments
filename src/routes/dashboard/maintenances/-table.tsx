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
import type { MaintenanceRequestsResponse } from '@/pocketbase/queries/maintenanceRequests';

export const columns: ColumnDef<MaintenanceRequestsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/maintenances' });
      const searchQuery = useSearch({ from: '/dashboard/maintenances/' })
      return <Checkbox
        checked={searchQuery.selected.length === table.getRowModel().rows.map(row => row.original.id).length}
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
      const navigate = useNavigate({ from: '/dashboard/maintenances' });
      const searchQuery = useSearch({ from: '/dashboard/maintenances/' })

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                searchQuery.selected.push(row.original.id)
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected,
                  }),
                })
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected.filter((id: string) => id !== row.original.id),
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
    accessorKey: 'tenant',
    enableSorting: false,
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
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Address" />,
    cell: ({ row }) => {
      const unit = row.original.expand?.unit;
      const letter = unit?.unitLetter ?? 'N/A';
      const floor = unit?.floorNumber ?? 'N/A';
      return `${floor}${letter}`;
    },
  },
  {
    accessorKey: 'description',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="truncate w-32">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'urgency',
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated'));
      return Number.isNaN(date.getTime()) ? 'N/A' : format(date, 'PPP');
    },
  },
];

