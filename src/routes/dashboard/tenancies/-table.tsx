import type { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/ui/kibo-ui/table";
import type { TenanciesResponse } from "@/pocketbase/queries/tenancies";
import { format } from "date-fns";

export const columns: ColumnDef<TenanciesResponse>[] = [
  {
    accessorKey: "expand.tenant",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Tenant"
      />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Apartment Unit" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.unit.unitLetter} - ${row.original.expand.unit.floorNumber}`,
  },
  {
    accessorKey: "leaseStartDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease Start Date" />
    ),
    cell: ({ row }) => format(row.original.leaseStartDate, "PPP"),
  },
  {
    accessorKey: "leaseEndDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Lease End Date" />
    ),
    cell: ({ row }) => format(row.original.leaseEndDate, "PPP"),
  },
];
