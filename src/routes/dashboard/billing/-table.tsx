import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { BillsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<BillsResponse>[] = [
  {
    accessorKey: 'tenancy',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenancy" />
    ),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Due Date" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
  },
];
