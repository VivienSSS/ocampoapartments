import type { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/ui/kibo-ui/table";
import type { AnnouncementsResponse } from "@/pocketbase/queries/announcements";

export const columns: ColumnDef<AnnouncementsResponse>[] = [
  {
    accessorKey: "author",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Author"
      />
    ),
    cell: ({ row }) =>
      `${row.original.expand.author.firstName} ${row.original.expand.author.lastName}`,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Message" />
    ),
  },
];
