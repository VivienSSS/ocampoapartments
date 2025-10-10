import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { MaintenanceWorkersResponse } from '@/pocketbase/types';

export const columns: ColumnDef<MaintenanceWorkersResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
      const searchQuery = useSearch({ from: '/dashboard/maintenanceworkers/' })
      return <Checkbox
        checked={searchQuery.selected.length > 0 && searchQuery.selected.length === table.getRowModel().rows.length}
        onCheckedChange={(checked) => {
          if (checked) {
            navigate({
              search: (prev) => ({
                ...prev,
                selected: table.getRowModel().rows.map(row => row.original.id),
              }),
            })
          } else {
            navigate({
              search: (prev) => ({
                ...prev,
                selected: []
              }),
            })
          }
        }
        }
      />
    },
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
      const searchQuery = useSearch({ from: '/dashboard/maintenanceworkers/' })

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: [...searchQuery.selected, row.original.id],
                  }),
                })
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected.filter((id: string) => id !== row.original.id),
                  }),
                })
              }
            }
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'contactDetails',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Contact Details" />
    ),
  },
  {
    accessorKey: 'isAvailable',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Availability" />
    ),
    cell: ({ row }) => row.getValue('isAvailable') ? 'Available' : 'Not Available',
  },
  {
    accessorKey: 'created',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('created')), 'PPP'),
  },
  {
    accessorKey: 'updated',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('updated')), 'PPP'),
  },
];
