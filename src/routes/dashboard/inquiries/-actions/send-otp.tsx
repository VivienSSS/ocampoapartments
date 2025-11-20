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
import { pb } from '@/pocketbase';
import { Collections, type InquiryResponse, type OtpResponse } from '@/pocketbase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SendOtpDialogProps {
  inquiry: InquiryResponse;
}

export function SendOtpDialog({ inquiry }: SendOtpDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      // First, check if OTP already exists
      let otp: OtpResponse | null = null;
      try {
        otp = await pb
          .collection(Collections.Otp)
          .getFirstListItem(`inquiry = '${inquiry.id}'`) as OtpResponse;
      } catch (err) {
        // OTP doesn't exist, create it
        otp = await pb.collection(Collections.Otp).create({
          inquiry: inquiry.id,
        }) as OtpResponse;
      }

      // Update OTP to trigger email sending (n8n watches for hasSent = false)
      if (otp) {
        await pb.collection(Collections.Otp).update(otp.id, {
          hasSent: false, // This triggers n8n to send email
          sentAt: new Date().toISOString(),
        });
      }

      return otp;
    },
    onSuccess: () => {
      toast.success('OTP email sent successfully. The applicant should receive it within a few minutes.');
      queryClient.invalidateQueries({ queryKey: [Collections.Inquiry] });
      queryClient.invalidateQueries({ queryKey: [Collections.Otp] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to send OTP. Please try again.');
    },
  });

  const isAlreadyVerified = inquiry.emailVerified;
  const isPending = inquiry.status === 'pending';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isAlreadyVerified ? "outline" : "secondary"} 
          size="sm"
          disabled={isAlreadyVerified}
          title={isAlreadyVerified ? "Email already verified" : "Send OTP verification email"}
        >
          <Mail className="w-4 h-4 mr-2" />
          {isAlreadyVerified ? 'Verified' : 'Send OTP'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send OTP Verification Email</DialogTitle>
          <DialogDescription>
            This will send a 6-digit OTP to {inquiry.email} for email verification.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isAlreadyVerified && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This email has already been verified. No need to send another OTP.
              </AlertDescription>
            </Alert>
          )}

          {!isPending && !isAlreadyVerified && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This inquiry is already in "{inquiry.status}" status. You can still resend the OTP if needed.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md bg-blue-50 p-4 space-y-2">
            <p className="text-sm text-blue-700">
              <strong>Recipient:</strong> {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Status:</strong> {inquiry.status}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Email Verified:</strong> {inquiry.emailVerified ? '✓ Yes' : '✗ No'}
            </p>
          </div>

          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700 font-semibold mb-2">
              What happens next:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>A 6-digit OTP will be generated automatically</li>
              <li>OTP will be valid for 5 minutes</li>
              <li>Email will be sent to {inquiry.email}</li>
              <li>Applicant must enter OTP to verify their email</li>
              <li>Once verified, you can accept or reject the inquiry</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => sendOtpMutation.mutate()}
            disabled={sendOtpMutation.isPending}
          >
            {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
