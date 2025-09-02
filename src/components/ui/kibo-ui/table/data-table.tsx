import type React from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from '.';

export function DataTable<TData, TValue>(
  props: Omit<
    React.ComponentProps<typeof TableProvider<TData, TValue>>,
    'children' | 'data'
  > & {
    data: {
      page: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      items: TData[];
    };
  },
) {
  return (
    <TableProvider
      columns={props.columns}
      data={props.data.items}
      className={props.className}
    >
      <TableHeader>
        {({ headerGroup }) => (
          <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
            {({ header }) => <TableHead header={header} key={header.id} />}
          </TableHeaderGroup>
        )}
      </TableHeader>
      <TableBody>
        {({ row }) => (
          <TableRow key={row.id} row={row}>
            {({ cell }) => <TableCell cell={cell} key={cell.id} />}
          </TableRow>
        )}
      </TableBody>
    </TableProvider>
  );
}

export default DataTable;
