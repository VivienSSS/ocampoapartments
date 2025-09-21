import type { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/ui/kibo-ui/table";
import type { TenantsResponse } from "@/pocketbase/queries/tenants";

export const columns: ColumnDef<TenantsResponse>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.original.expand.user.contactEmail,
  },
  {
    accessorKey: "facebookName",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Facebook Name" />
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => row.original.expand.user.firstName,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => row.original.expand.user.lastName,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Phone Number" />
    ),
  },
];
