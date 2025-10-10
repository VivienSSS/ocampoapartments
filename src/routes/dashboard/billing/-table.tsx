import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSuspenseQuery } from '@tanstack/react-query';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { BillsResponse } from '@/pocketbase/queries/bills';

export const columns: ColumnDef<BillsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/billing' });
      const searchQuery = useSearch({ from: '/dashboard/billing/' })
      return <Checkbox
        checked={searchQuery.selected.length === table.getRowModel().rows.map(row => row.original.id).length}
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
      const navigate = useNavigate({ from: '/dashboard/billing' });
      const searchQuery = useSearch({ from: '/dashboard/billing/' })

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                searchQuery.selected.push(row.original.id)
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected,
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
    accessorKey: 'chargeTypes',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Charge Types" />
    ),
    cell: ({ row }) => {
      const billId = row.original.id;
      const { data } = useSuspenseQuery({
        queryKey: [Collections.BillItems, billId],
        queryFn: () =>
          pb.collection(Collections.BillItems).getList(1, 100, {
            filter: `bill = '${billId}'`,
          }),
      });

      const types = (data?.items ?? []).map((i: any) => i.chargeType).filter(Boolean);
      const unique = Array.from(new Set(types));

      return unique.length ? unique.join(', ') : '—';
    },
  },

  {
    accessorKey: 'tenancy',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Tenancy" />
    ),
    cell: ({ row }) =>
      `${row.original.expand.tenancy.expand.tenant.expand.user.firstName} ${row.original.expand.tenancy.expand.tenant.expand.user.lastName}`,
  },
  {
    accessorKey: 'dueDate',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => format(row.original.dueDate, 'PPP'),
  },
  {
    accessorKey: 'status',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'Paid'
              ? 'default'
              : status === 'Due'
                ? 'secondary'
                : 'destructive'
          }
        >
          {status}
        </Badge>
      );
    },
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
