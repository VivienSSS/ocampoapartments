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
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AcceptInquiryDialogProps {
  inquiry: InquiryResponse;
}

export function AcceptInquiryDialog({ inquiry }: AcceptInquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async () => {
      // Update inquiry status to approved
      await pb.collection(Collections.Inquiry).update(inquiry.id, {
        status: 'approved',
        rejectionReason: note || null, // Store acceptance note/reason
      });
    },
    onSuccess: () => {
      toast.success('Inquiry approved successfully');
      queryClient.invalidateQueries({ queryKey: [Collections.Inquiry] });
      setOpen(false);
      setNote('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to approve inquiry');
    },
  });

  const canAccept = inquiry.emailVerified && inquiry.status === 'verified';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          disabled={!canAccept}
          title={
            !canAccept
              ? 'Email must be verified before accepting'
              : 'Accept this inquiry'
          }
        >
          <Check className="w-4 h-4 mr-2" />
          Accept
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Inquiry</DialogTitle>
          <DialogDescription>
            Accept this inquiry to proceed with account creation and tenant activation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              <strong>Applicant:</strong> {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-green-700">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-sm text-green-700">
              <strong>Status:</strong> {inquiry.status}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Acceptance Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any notes about this approval..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This note will be stored for audit purposes.
            </p>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-700">
              <strong>Next Steps:</strong>
              <br />
              • Inquiry status will be set to "approved"
              <br />
              • Account creation process will be initiated
              <br />
              • Tenant will be activated in the system
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? 'Processing...' : 'Accept Inquiry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
