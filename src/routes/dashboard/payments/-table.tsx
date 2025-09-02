import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { PaymentsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<PaymentsResponse>[] = [
    {
        accessorKey: 'bill',
        header: ({ column }) => <TableColumnHeader column={column} title="Bill" />,
    },
    {
        accessorKey: 'tenant',
        header: ({ column }) => <TableColumnHeader column={column} title="Tenant" />,
    },
    {
        accessorKey: 'paymentMethod',
        header: ({ column }) => <TableColumnHeader column={column} title="Payment Method" />,
    },
    {
        accessorKey: 'amountPaid',
        header: ({ column }) => <TableColumnHeader column={column} title="Amount Paid" />,
    },
    {
        accessorKey: 'paymentDate',
        header: ({ column }) => <TableColumnHeader column={column} title="Payment Date" />,
    },
    {
        accessorKey: 'transactionId',
        header: ({ column }) => <TableColumnHeader column={column} title="Transaction ID" />,
    },
    {
        accessorKey: 'screenshot',
        header: ({ column }) => <TableColumnHeader column={column} title="Screenshot" />,
    },
];
