import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { PropertiesResponse } from '@/pocketbase/types';

export const columns: ColumnDef<PropertiesResponse>[] = [
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: 'branch',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Branch" />
    ),
  },
];
