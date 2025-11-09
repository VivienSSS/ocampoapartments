import type { ColumnDef } from '@tanstack/react-table';
import type { ApartmentUnitsResponse, InquiryResponse, PropertiesResponse } from '@/pocketbase/types';

export const columns: ColumnDef<InquiryResponse<{ unitInterested: ApartmentUnitsResponse<{ property: PropertiesResponse }> }>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'numberOfOccupants',
    header: 'Occupants',
  },
  {
    accessorKey: 'unitInterested',
    header: 'Unit Interested',
    cell: ({ row }) => `${row.original.expand.unitInterested.floorNumber} - ${row.original.expand.unitInterested.unitLetter} - ${row.original.expand.unitInterested.expand.property.branch}`
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
  {
    accessorKey: 'created',
    header: 'Created',
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
  },
];
