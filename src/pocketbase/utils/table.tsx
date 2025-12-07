import type { ColumnDef } from '@tanstack/react-table';
import schema from '../../../public/schema.json';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  ToggleRight,
  Calendar,
  FileText,
  Link as LinkIcon,
  Type,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { ViewQueryOption } from '../query';
import { useRouteContext } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { pb } from '..';

const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const schemaToColumnDef = (collection: string) => {
  const table = schema.find((col) => col.name === collection);

  // biome-ignore lint/suspicious/noExplicitAny: acceptable use of any here
  const columns: ColumnDef<any>[] = [];

  for (const field of table?.fields || []) {
    if (field.hidden) continue;

    // check if primary key
    if (field.primaryKey) {
      // continue;
      columns.push({
        id: field.name,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={table.getToggleAllPageRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={row.getToggleSelectedHandler()}
          />
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
              {toTitleCase(field.name)}
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
          header: () => (
            <div className="flex items-center gap-2.5">
              <Calendar size={14} />
              {toTitleCase(field.name)}
            </div>
          ),
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
      case 'file':
        columns.push({
          header: () => (
            <div className="flex items-center gap-2.5">
              <FileText size={14} />
              {toTitleCase(field.name)}
            </div>
          ),
          accessorKey: field.name,
          cell: (info) => {
            const fileValue = info.getValue() as string | undefined;
            if (!fileValue) {
              return 'N/A';
            }
            console.log(fileValue);
            const fileUrl = pb.files.getURL(info.row.original, fileValue);
            const fileName = fileValue;
            return (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {fileName}
              </a>
            );
          },
        });
        break;
      case 'relation':
        // if relation is multiple, skip for now
        // @ts-ignore
        if (field.maxSelect > 1) {
          columns.push({
            header: () => (
              <div className="flex items-center gap-2.5">
                <LinkIcon size={14} />
                {toTitleCase(field.name)}
              </div>
            ),
            accessorKey: field.name,
            cell: (info) => {
              const { pocketbase } = useRouteContext({
                from: '/dashboard/$collection',
              });

              const { data } = useSuspenseQuery({
                queryKey: [field.name, info.getValue()],
                queryFn: async () => {
                  // @ts-ignore
                  const relatedIds = info.getValue() as string[];
                  const relatedTable = schema.find(
                    // @ts-ignore
                    (col) => col.id === field.collectionId,
                  );

                  if (!relatedTable) return [];

                  const records = await Promise.all(
                    relatedIds.map((id) =>
                      pocketbase.collection(relatedTable.name).getOne(id),
                    ),
                  );

                  return records;
                },
              });

              if (data.length === 0) {
                return 'N/A';
              }

              const relatedTable = schema.find(
                // @ts-ignore
                (col) => col.id === field.collectionId,
              );

              const presentableFields = relatedTable?.fields
                .filter((row) => row.presentable)
                .map((row) => row.name);

              return (
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge>
                      <ExternalLink />
                      {data
                        .map((record) =>
                          presentableFields
                            ?.map((row) => record[row])
                            .join(', '),
                        )
                        .join(' | ')}
                    </Badge>
                  </DialogTrigger>
                  <DialogContent
                    className="max-h-3/4 overflow-y-auto"
                    showCloseButton={false}
                  >
                    <DialogTitle>{field.name} Information</DialogTitle>
                    <ItemSeparator />
                    <ItemGroup className="gap-2.5">
                      {data.map((record, index) => (
                        <Item
                          size={'sm'}
                          variant={'muted'}
                          key={record.id || index}
                        >
                          <ItemContent className="flex flex-col gap-2">
                            {relatedTable?.fields
                              .filter((row) => !row.hidden)
                              .map((row) => {
                                switch (row.type) {
                                  case 'bool':
                                    return (
                                      <div
                                        className="flex flex-row justify-between"
                                        key={row.name}
                                      >
                                        <ItemTitle>{row.name}</ItemTitle>
                                        <ItemDescription>
                                          <Badge>
                                            {(record[row.name] as boolean)
                                              ? 'Yes'
                                              : 'No'}
                                          </Badge>
                                        </ItemDescription>
                                      </div>
                                    );
                                  case 'date':
                                  case 'autodate':
                                    return (
                                      <div
                                        className="flex flex-row justify-between"
                                        key={row.name}
                                      >
                                        <ItemTitle>{row.name}</ItemTitle>
                                        <ItemDescription>
                                          {row.required === false &&
                                            !record[row.name]
                                            ? 'N/A'
                                            : format(
                                              new Date(record[row.name]),
                                              'PPP',
                                            )}
                                        </ItemDescription>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div
                                        className="flex flex-row justify-between"
                                        key={row.name}
                                      >
                                        <ItemTitle>{row.name}</ItemTitle>
                                        <ItemDescription>
                                          {record[row.name]?.toString() ||
                                            'N/A'}
                                        </ItemDescription>
                                      </div>
                                    );
                                }
                              })}
                          </ItemContent>
                        </Item>
                      ))}
                    </ItemGroup>
                  </DialogContent>
                </Dialog>
              );
            },
          });
          break;
        }

        columns.push({
          header: () => (
            <div className="flex items-center gap-2.5">
              <LinkIcon size={14} />
              {toTitleCase(field.name)}
            </div>
          ),
          accessorKey: field.name,
          cell: (info) => {
            const { pocketbase } = useRouteContext({
              from: '/dashboard/$collection',
            });

            const { data } = useSuspenseQuery(
              ViewQueryOption(
                pocketbase,
                //@ts-ignore
                field.collectionId,
                info.getValue() as string,
              ),
            );

            const relatedTable = schema.find(
              //@ts-ignore
              (col) => col.id === field.collectionId,
            );

            const presentableFields = relatedTable?.fields
              .filter((row) => row.presentable)
              .map((row) => row.name)
              .splice(0, 2);

            return (
              <Dialog>
                <DialogTrigger asChild>
                  <Badge>
                    <ExternalLink />
                    {presentableFields?.map((row) => data[row]).join(', ')}
                  </Badge>
                </DialogTrigger>
                <DialogContent
                  className="max-h-3/4 overflow-y-auto"
                  showCloseButton={false}
                >
                  <DialogTitle>{field.name} Information</DialogTitle>
                  <ItemSeparator />
                  <ItemGroup className="gap-2.5">
                    {relatedTable?.fields
                      .filter((row) => !row.hidden)
                      .map((row) => {
                        switch (row.type) {
                          case 'bool':
                            return (
                              <Item
                                size={'sm'}
                                variant={'muted'}
                                key={row.name}
                              >
                                <ItemContent className="flex flex-row justify-between">
                                  <ItemTitle>{row.name}</ItemTitle>
                                  <ItemDescription>
                                    <Badge>
                                      {(data[row.name] as boolean)
                                        ? 'Yes'
                                        : 'No'}
                                    </Badge>
                                  </ItemDescription>
                                </ItemContent>
                              </Item>
                            );
                          case 'date':
                          case 'autodate':
                            return (
                              <Item
                                size={'sm'}
                                variant={'muted'}
                                key={row.name}
                              >
                                <ItemContent className="flex flex-row justify-between">
                                  <ItemTitle>{row.name}</ItemTitle>
                                  <ItemDescription>
                                    {row.required === false && !data[row.name]
                                      ? 'N/A'
                                      : format(new Date(data[row.name]), 'PPP')}
                                  </ItemDescription>
                                </ItemContent>
                              </Item>
                            );
                          default:
                            return (
                              <Item
                                key={row.name}
                                size={'sm'}
                                variant={'muted'}
                              >
                                <ItemContent className="flex flex-row justify-between">
                                  <ItemTitle>{row.name}</ItemTitle>
                                  <ItemDescription>
                                    {data[row.name]?.toString() || 'N/A'}
                                  </ItemDescription>
                                </ItemContent>
                              </Item>
                            );
                        }
                      })}
                  </ItemGroup>
                </DialogContent>
              </Dialog>
            );
          },
        });
        break;
      default:
        columns.push({
          header: () => (
            <div className="flex items-center gap-2.5">
              <Type size={14} />
              {toTitleCase(field.name)}
            </div>
          ),
          accessorKey: field.name,
          cell: (info) => info.getValue(),
        });
        break;
    }
  }

  return { columns, table };
};
