import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InquiryResponse } from '@/pocketbase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    approveInquiryMutation,
    rejectInquiryMutation,
    listInqueryQuery,
} from '@/pocketbase/queries/inquries';

interface InquiryApprovalDialogProps {
    inquiry: InquiryResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page: number;
    perPage: number;
}

export function InquiryApprovalDialog({
    inquiry,
    open,
    onOpenChange,
    page,
    perPage,
}: InquiryApprovalDialogProps) {
    const [activeTab, setActiveTab] = useState<'approve' | 'reject'>('approve');
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const queryClient = useQueryClient();

    const approveMutation = useMutation(approveInquiryMutation);
    const rejectMutation = useMutation(rejectInquiryMutation);

    const handleApprove = async () => {
        if (!inquiry) return;
        approveMutation.mutate(
            {
                inquiryId: inquiry.id,
                approval_notes: approvalNotes,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(listInqueryQuery(page, perPage));
                    onOpenChange(false);
                    setApprovalNotes('');
                },
            }
        );
    };

    const handleReject = async () => {
        if (!inquiry || !rejectionReason.trim()) return;
        rejectMutation.mutate(
            {
                inquiryId: inquiry.id,
                rejection_reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(listInqueryQuery(page, perPage));
                    onOpenChange(false);
                    setRejectionReason('');
                },
            }
        );
    };

    if (!inquiry) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Review Inquiry</DialogTitle>
                    <DialogDescription>
                        {inquiry.firstName} {inquiry.lastName} - {inquiry.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2">
                            <Label className="font-semibold text-xs text-gray-600">Name</Label>
                            <p className="font-medium border-b-2 border-gray-400 pb-1">{inquiry.firstName} {inquiry.lastName}</p>
                        </div>
                        <div>
                            <Label className="font-semibold text-xs text-gray-600">Age</Label>
                            <p className="font-medium border-b-2 border-gray-400 pb-1">{inquiry.age}</p>
                        </div>
                        <div>
                            <Label className="font-semibold text-xs text-gray-600">
                                Occupants
                            </Label>
                            <p className="font-medium border-b-2 border-gray-400 pb-1">{inquiry.numberOfOccupants}</p>
                        </div>
                        <div className="col-span-2">
                            <Label className="font-semibold text-xs text-gray-600">
                                Phone
                            </Label>
                            <p className="font-medium border-b-2 border-gray-400 pb-1">{inquiry.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <Label className="font-semibold text-xs text-gray-600">
                                Email
                            </Label>
                            <p className="font-medium break-all text-sm border-b-2 border-gray-400 pb-1">{inquiry.email}</p>
                        </div>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={(v) => setActiveTab(v as 'approve' | 'reject')}
                        className="mt-4"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="approve">Approve</TabsTrigger>
                            <TabsTrigger value="reject">Reject</TabsTrigger>
                        </TabsList>

                        <TabsContent value="approve" className="space-y-4">
                            <div className="mt-4 space-y-5">
                                <Label htmlFor="approval-notes">Notes (Optional)</Label>
                                <Textarea
                                    id="approval-notes"
                                    placeholder="Add any notes about the approval..."
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="reject" className="space-y-6">
                            <div className='space-y-5 mt-4'>
                                <Label htmlFor="rejection-reason" className='gap-6'>Reason for Rejection</Label>
                                <Textarea
                                    id="rejection-reason"
                                    placeholder="Explain why this inquiry is being rejected..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className='gap-y-5'>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className='space-y-5'>
                        Cancel
                    </Button>
                    {activeTab === 'approve' ? (
                        <Button
                            onClick={handleApprove}
                            disabled={approveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {approveMutation.isPending ? 'Approving...' : 'Approve'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleReject}
                            disabled={!rejectionReason.trim() || rejectMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
