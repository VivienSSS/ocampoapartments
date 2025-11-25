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
import { Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

      // TODO: Phase 3 - Account creation will be triggered here
      // This could be done via:
      // 1. PocketBase hooks watching for approved status
      // 2. n8n automation triggered by status change
      // 3. Separate admin action to create account after approval
    },
    onSuccess: () => {
      toast.success('Inquiry approved successfully. Account creation process will begin.');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Accept Inquiry</DialogTitle>
          <DialogDescription>
            Accept this inquiry to proceed with account creation and tenant activation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!canAccept && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This inquiry cannot be accepted because the email has not been verified.
                Please send an OTP and wait for the applicant to verify their email first.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md bg-green-50 p-4 space-y-2">
            <p className="text-sm text-green-700">
              <strong>Applicant:</strong> {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-green-700">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-sm text-green-700">
              <strong>Phone:</strong> {inquiry.phone}
            </p>
            <p className="text-sm text-green-700">
              <strong>Age:</strong> {inquiry.age}
            </p>
            <p className="text-sm text-green-700">
              <strong>Occupants:</strong> {inquiry.numberOfOccupants}
            </p>
            <p className="text-sm text-green-700">
              <strong>Current Status:</strong> {inquiry.status}
            </p>
            <p className="text-sm text-green-700">
              <strong>Email Verified:</strong> {inquiry.emailVerified ? '✓ Yes' : '✗ No'}
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
            <p className="text-sm text-blue-700 font-semibold mb-2">
              Next Steps After Approval:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Inquiry status will be set to "approved"</li>
              <li>Phase 3: Account Creation process will be triggered</li>
              <li>User account will be created with "Applicant" role</li>
              <li>Tenant record will be linked to the user account</li>
              <li>Applicant will receive activation email</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending || !canAccept}
          >
            {acceptMutation.isPending ? 'Processing...' : 'Accept Inquiry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
