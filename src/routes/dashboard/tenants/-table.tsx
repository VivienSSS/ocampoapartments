import type { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/ui/kibo-ui/table";
import type { TenantsResponse } from "@/pocketbase/queries/tenants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const columns: ColumnDef<TenantsResponse>[] = [
  {
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate({ from: "/dashboard/tenants" });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
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
                })}
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
                })}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
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
