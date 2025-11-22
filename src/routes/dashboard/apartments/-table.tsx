import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, Image as ImageIcon, Eye } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import { pb } from '@/pocketbase';
import { ImageViewer } from './-image-viewer';

const MainImageCell = ({ unit }: { unit: ApartmentUnitsResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const image = unit.image;

  if (!image) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <img
          src={pb.files.getURL(unit, image)}
          alt="Main"
          className="w-8 h-8 rounded object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1 h-auto px-2 py-1 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Button>
      </div>
      <ImageViewer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={[pb.files.getURL(unit, image)]}
        title="Main Image"
      />
    </>
  );
};

const GalleryCell = ({ unit }: { unit: ApartmentUnitsResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const carouselImages = unit.carousel_image;
  const count = Array.isArray(carouselImages) ? carouselImages.length : 0;

  if (count === 0) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const imageUrls = carouselImages.map((img) =>
    pb.files.getURL(unit, img)
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          {carouselImages.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={pb.files.getURL(unit, img)}
              alt={`Gallery ${index + 1}`}
              className="w-6 h-6 rounded border border-background object-cover"
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1 h-auto px-2 py-1 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Button>
      </div>
      <ImageViewer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={imageUrls}
        title={`Gallery (${count} images)`}
      />
    </>
  );
};

export const columns: ColumnDef<ApartmentUnitsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/apartments' });
      const searchQuery = useSearch({ from: '/dashboard/apartments/' });
      return (
        <Checkbox
          checked={
            searchQuery.selected.length ===
            table.getRowModel().rows.map((row) => row.original.id).length
          }
          onCheckedChange={(checked) => {
            if (checked) {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: table
                    .getRowModel()
                    .rows.map((row) => row.original.id),
                }),
              });
            } else {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: [],
                }),
              });
            }
          }}
        />
      );
    },
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/apartments' });
      const searchQuery = useSearch({ from: '/dashboard/apartments/' });

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                searchQuery.selected.push(row.original.id);
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected,
                  }),
                });
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected.filter(
                      (id: string) => id !== row.original.id,
                    ),
                  }),
                });
              }
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'unitLetter',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Unit Letter" />
    ),
  },
  {
    accessorKey: 'floorNumber',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Floor Number" />
    ),
  },
  {
    accessorKey: 'capacity',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Capacity" />
    ),
  },
  {
    accessorKey: 'price',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Price" />,
    cell: ({ row }) =>
      new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(row.getValue('price')),
  },
  {
    accessorKey: 'room_size',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Room Size (m²)" />
    ),
    cell: ({ row }) => {
      const roomSize = row.getValue('room_size');
      return roomSize ? `${roomSize} m²` : '-';
    },
  },
  {
    accessorKey: 'image',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Main Image" />
    ),
    cell: ({ row }) => <MainImageCell unit={row.original} />,
  },
  {
    accessorKey: 'carousel_image',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Gallery" />
    ),
    cell: ({ row }) => <GalleryCell unit={row.original} />,
  },
  {
    accessorKey: 'property',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => row.original.expand.property.branch,
  },
  {
    accessorKey: 'isAvailable',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('isAvailable') ? 'default' : 'secondary'}>
        {row.getValue('isAvailable') ? 'Available' : 'Unavailable'}
      </Badge>
    ),
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
