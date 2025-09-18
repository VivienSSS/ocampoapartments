import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { TenanciesResponse } from '@/pocketbase/types';

export const columns: ColumnDef<TenanciesResponse>[] = [
    {
        accessorKey: 'tenant',
        header: ({ column }) => <TableColumnHeader column={column} title="Tenant" />,
    },
    {
        accessorKey: 'unit',
        header: ({ column }) => <TableColumnHeader column={column} title="Apartment Unit" />,
    },
    {
        accessorKey: 'leaseStartDate',
        header: ({ column }) => <TableColumnHeader column={column} title="Lease Start Date" />,
    },
    {
        accessorKey: 'leaseEndDate',
        header: ({ column }) => <TableColumnHeader column={column} title="Lease End Date" />,
    },
];
