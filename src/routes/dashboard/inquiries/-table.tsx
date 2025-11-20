import type { ColumnDef } from '@tanstack/react-table';
import { ZoomIn, ZoomOut, CheckCircle, XCircle, UserPlus } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse, InquiryResponse, PropertiesResponse, OtpResponse } from '@/pocketbase/types';
import { Badge } from '@/components/ui/badge';

interface ColumnsProps {
  onApprove: (inquiry: InquiryResponse) => void;
  onCreateAccount: (inquiry: InquiryResponse) => void;
}

export const columns = ({ onApprove, onCreateAccount }: ColumnsProps): ColumnDef<InquiryResponse<{ unitInterested: ApartmentUnitsResponse<{ property: PropertiesResponse }>, otp: OtpResponse }>>[] => [
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        verified: 'bg-blue-100 text-blue-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
      };
      return (
        <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'approval_status',
    header: 'Approval',
    cell: ({ row }) => {
      const approvalStatus = row.original.approval_status || 'pending';
      const statusColors: Record<string, string> = {
        pending: 'bg-gray-100 text-gray-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
      };
      return (
        <Badge className={statusColors[approvalStatus] || 'bg-gray-100 text-gray-800'}>
          {approvalStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    header: 'Email Verified',
    cell: ({ row }) => {
      const emailVerified = row.original.emailVerified;
      return (
        <Badge variant={emailVerified ? 'default' : 'secondary'}>
          {emailVerified ? 'Verified' : 'Pending'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'expand.otp.hasSent',
    header: 'OTP Sent',
    cell: ({ row }) => {
      const otp = row.original.expand?.otp;
      const hasSent = otp?.hasSent || false;
      return (
        <Badge variant={hasSent ? 'default' : 'outline'}>
          {hasSent ? 'Sent' : 'Pending'}
        </Badge>
      );
    },
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
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const inquiry = row.original;
      const isApproved = inquiry.approval_status === 'approved';
      const isVerified = inquiry.emailVerified;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {inquiry.approval_status !== 'approved' && inquiry.approval_status !== 'rejected' && (
              <DropdownMenuItem
                onClick={() => onApprove(inquiry)}
                className="cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve or Reject
              </DropdownMenuItem>
            )}
            {isApproved && isVerified && (
              <DropdownMenuItem
                onClick={() => onCreateAccount(inquiry)}
                className="cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </DropdownMenuItem>
            )}
            {inquiry.approval_status === 'rejected' && (
              <DropdownMenuItem disabled className="text-xs">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
