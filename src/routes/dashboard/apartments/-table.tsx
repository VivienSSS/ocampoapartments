import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { ApartmentUnitsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<ApartmentUnitsResponse>[] = [
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
    accessorKey: 'property',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Property" />
    ),
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
