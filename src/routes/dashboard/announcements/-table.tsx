import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { AnnouncementsResponse } from '@/pocketbase/types';

export const columns: ColumnDef<AnnouncementsResponse>[] = [
    {
        accessorKey: 'author',
        header: ({ column }) => <TableColumnHeader column={column} title="Author" />,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    },
    {
        accessorKey: 'message',
        header: ({ column }) => <TableColumnHeader column={column} title="Message" />,
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <TableColumnHeader column={column} title="Created At" />,
    },

];
