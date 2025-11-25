import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { pb } from '@/pocketbase';
import { Collections, type InquiryResponse } from '@/pocketbase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RejectInquiryDialogProps {
  inquiry: InquiryResponse;
}

export function RejectInquiryDialog({ inquiry }: RejectInquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!reason.trim()) {
        throw new Error('Rejection reason is required');
      }

      if (reason.trim().length < 10) {
        throw new Error('Rejection reason must be at least 10 characters');
      }

      // Update inquiry status to rejected
      await pb.collection(Collections.Inquiry).update(inquiry.id, {
        status: 'rejected',
        rejectionReason: reason.trim(),
      });

      // Note: Email notification will be sent via external automation (n8n or PocketBase hooks)
      // that watches for status changes to 'rejected'
    },
    onSuccess: () => {
      toast.success('Inquiry rejected. Rejection email will be sent to the applicant.');
      queryClient.invalidateQueries({ queryKey: [Collections.Inquiry] });
      setOpen(false);
      setReason('');
      setError('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reject inquiry');
    },
  });

  const handleReject = () => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }
    setError('');
    rejectMutation.mutate();
  };

  const handleClose = () => {
    setOpen(false);
    setReason('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reject Inquiry
          </DialogTitle>
          <DialogDescription>
            Reject this inquiry and notify the applicant. A detailed rejection reason is required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action will permanently reject this inquiry. The applicant will receive an email
              with the rejection reason you provide below.
            </AlertDescription>
          </Alert>

          <div className="rounded-md bg-red-50 p-4 space-y-2">
            <p className="text-sm text-red-700">
              <strong>Applicant:</strong> {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-red-700">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-sm text-red-700">
              <strong>Phone:</strong> {inquiry.phone}
            </p>
            <p className="text-sm text-red-700">
              <strong>Current Status:</strong> {inquiry.status}
            </p>
            {inquiry.message && (
              <p className="text-sm text-red-700">
                <strong>Message:</strong> {inquiry.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a clear and professional reason for rejection (minimum 10 characters)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-muted-foreground">
              This reason will be sent to the applicant via email and logged for audit purposes.
              Please be professional and specific.
            </p>
          </div>

          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700 font-semibold mb-2">
              This action will:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Set inquiry status to "rejected"</li>
              <li>Send rejection email to <strong>{inquiry.email}</strong> with your reason</li>
              <li>Prevent any further processing or account creation</li>
              <li>Log rejection reason and timestamp for audit trail</li>
              <li>Tenant account will remain inactive</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectMutation.isPending || !reason.trim()}
          >
            {rejectMutation.isPending ? 'Processing...' : 'Reject Inquiry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
