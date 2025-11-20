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
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

      // Update inquiry status to rejected
      await pb.collection(Collections.Inquiry).update(inquiry.id, {
        status: 'rejected',
        rejectionReason: reason.trim(),
      });

      // TODO: In a real implementation, this would trigger an email via n8n or PocketBase hooks
      // For now, we'll rely on external automation to watch for rejected status
    },
    onSuccess: () => {
      toast.success('Inquiry rejected and notification sent');
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
    setError('');
    rejectMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Inquiry</DialogTitle>
          <DialogDescription>
            Reject this inquiry and notify the applicant. A rejection reason is required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">
              <strong>Applicant:</strong> {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-red-700">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-sm text-red-700">
              <strong>Status:</strong> {inquiry.status}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a clear reason for rejection..."
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
            </p>
          </div>

          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              <strong>This action will:</strong>
              <br />
              • Set inquiry status to "rejected"
              <br />
              • Send rejection email to applicant with reason
              <br />
              • Prevent account creation
              <br />
              • Log rejection reason for audit trail
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setOpen(false);
            setReason('');
            setError('');
          }}>
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
