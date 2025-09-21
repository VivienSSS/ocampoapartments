import type { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/ui/kibo-ui/table";
import type { MaintenanceRequestsResponse } from "@/pocketbase/queries/maintenanceRequests";
import { format } from "date-fns";

export const columns: ColumnDef<MaintenanceRequestsResponse>[] = [
  {
    accessorKey: "tenant",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Tenant"
      />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenant.expand.user.firstName} ${row.original.expand.tenant.expand.user.firstName}`,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) =>
      `${row.original.expand.unit.unitLetter} - ${row.original.expand.unit.floorNumber}`,
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Urgency" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Status"
      />
    ),
  },
  {
    accessorKey: "worker",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Worker"
      />
    ),
    cell: ({ row }) => `${row.original.expand.worker.name}`,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "submittedDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Submitted Date" />
    ),
    cell: ({ row }) => format(row.original.submittedDate, "PPP"),
  },
  {
    accessorKey: "completedDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Completed Date" />
    ),
    cell: ({ row }) => format(row.original.completedDate, "PPP"),
  },
];
