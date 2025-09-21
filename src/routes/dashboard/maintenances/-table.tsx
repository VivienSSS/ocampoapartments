import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { MaintenanceRequestsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<MaintenanceRequestsResponse>[] = [
  {
    accessorKey: 'tenant',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenant" />
    ),
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
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
  },
  {
    accessorKey: 'completedDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Completed Date" />
    ),
  },
];
