import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { AnnouncementsResponse } from '@/pocketbase/queries/announcements';

export const columns: ColumnDef<AnnouncementsResponse>[] = [
  {
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/announcements' });

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
  {
    accessorKey: 'author',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.author.firstName} ${row.original.expand.author.lastName}`,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: 'message',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Message" />
    ),
  },
];

