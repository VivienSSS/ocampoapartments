import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { TenantsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<TenantsResponse>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'facebookName',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Facebook Name" />
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Phone Number" />
    ),
  },
];
