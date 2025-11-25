import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { AnnouncementsResponse, UsersRecord } from '../types';
import type { RecordListOptions } from 'pocketbase';

const columnHelper =
  createColumnHelper<
    AnnouncementsResponse<{
      author: UsersRecord;
    }>
  >();

export const options: RecordListOptions = {
  expand: 'author',
};

export const Actions = () => {
  return <div>Table Action</div>;
};
