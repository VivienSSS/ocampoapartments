import type { ColumnDef } from '@tanstack/react-table';
import schema from '../../../public/schema.json';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ToggleRight } from 'lucide-react';

export const schemaToColumnDef = (collection: string) => {
  const table = schema.find((col) => col.name === collection);

  // biome-ignore lint/suspicious/noExplicitAny: acceptable use of any here
  const columns: ColumnDef<any>[] = [];

  for (const field of table?.fields || []) {
    if (field.hidden) continue;

    // check if primary key
    if (field.primaryKey) {
      columns.push({
        id: field.name,
        header: field.name,
        accessorKey: field.name,
        cell: (info) => (
          <Badge variant={'secondary'}>{info.getValue() as string}</Badge>
        ),
      });
      continue;
    }

    switch (field.type) {
      case 'bool':
        columns.push({
          header: () => (
            <div className="flex items-center gap-2.5">
              <ToggleRight size={14} />
              {field.name}
            </div>
          ),
          accessorKey: field.name,
          cell: (info) => (
            <Badge>{(info.getValue() as boolean) ? 'Yes' : 'No'}</Badge>
          ),
        });
        break;
      case 'date':
      case 'autodate':
        columns.push({
          header: field.name,
          accessorKey: field.name,
          cell: (info) => {
            if (field.required === false && !info.getValue()) {
              return 'N/A';
            }
            const date = new Date(info.getValue() as Date);
            return format(date, 'PPP');
          },
        });
        break;
      case 'relation':
        columns.push({
          header: field.name,
          accessorKey: field.name,
          cell: (info) => {
            const value = info.getValue();
            if (Array.isArray(value)) {
              return value.join(', ');
            }
            return <Badge>{value as string}</Badge>;
          },
        });
        break;
      default:
        columns.push({
          header: field.name,
          accessorKey: field.name,
          cell: (info) => info.getValue(),
        });
        break;
    }
  }

  return { columns, table };
};
