import type { ColumnDef } from '@tanstack/react-table';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse, InquiryResponse, PropertiesResponse } from '@/pocketbase/types';

export const columns: ColumnDef<InquiryResponse<{ unitInterested: ApartmentUnitsResponse<{ property: PropertiesResponse }> }>>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  // },
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
    cell: ({ row }) => {
      const unit = row.original.expand?.unitInterested;
      const property = unit?.expand?.property;
      if (!unit || !property) return 'N/A';
      return `${unit.floorNumber} - ${unit.unitLetter} - ${property.branch}`;
    }
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
  {
    accessorKey: 'submission_type',
    header: 'Submission Type',
  },
  {
    accessorKey: 'qr_image_proof',
    header: 'Screenshot',
    cell: ({ row }) => {
      const [zoom, setZoom] = useState(100);

      const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
      const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Proof</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Screenshot</DialogTitle>
              <DialogDescription>{row.original.qr_image_proof}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-center overflow-auto max-h-[70vh]">
                <img
                  className="rounded-md"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    maxHeight: '70vh',
                  }}
                  src={pb.files.getURL(row.original, row.original.qr_image_proof)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
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
