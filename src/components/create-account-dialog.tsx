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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check } from 'lucide-react';
import type { InquiryResponse } from '@/pocketbase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createAccountMutation,
    listInqueryQuery,
} from '@/pocketbase/queries/inquries';
import { toast } from 'sonner';

interface CreateAccountDialogProps {
    inquiry: InquiryResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page: number;
    perPage: number;
}

export function CreateAccountDialog({
    inquiry,
    open,
    onOpenChange,
    page,
    perPage,
}: CreateAccountDialogProps) {
    const [credentials, setCredentials] = useState<{
        email: string;
        password: string;
        user_id: string;
        first_name: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    const createAccountMut = useMutation(createAccountMutation);

    const handleCreateAccount = async () => {
        if (!inquiry) return;
        createAccountMut.mutate(
            {
                inquiryId: inquiry.id,
            },
            {
                onSuccess: (data) => {
                    setCredentials({
                        email: data.email,
                        password: data.password,
                        user_id: data.user_id,
                        first_name: data.first_name,
                    });
                    queryClient.invalidateQueries(listInqueryQuery(page, perPage));
                },
            }
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
    };

    if (!inquiry) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>
                        Create a functional account for {inquiry.firstName}{' '}
                        {inquiry.lastName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {!credentials ? (
                        <div>
                            <Alert>
                                <AlertDescription>
                                    This will create a new account with temporary credentials. The
                                    credentials will be sent via email to {inquiry.email}.
                                </AlertDescription>
                            </Alert>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-xs text-gray-600">Name</p>
                                    <p className="font-medium">
                                        {inquiry.firstName} {inquiry.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-xs text-gray-600">Email</p>
                                    <p className="font-medium break-all text-sm">
                                        {inquiry.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <AlertDescription className="text-green-800 font-medium">
                                    ✓ Account created successfully
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-3 rounded-lg border p-4 bg-gray-50">
                                <h3 className="font-semibold text-sm">Login Credentials</h3>

                                <div>
                                    <label className="text-xs font-medium text-gray-600">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="flex-1 rounded bg-white px-2 py-1.5 font-mono text-xs border">
                                            {credentials.email}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(credentials.email)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-600">
                                        Temporary Password
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="flex-1 rounded bg-white px-2 py-1.5 font-mono text-xs break-all border">
                                            {credentials.password}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(credentials.password)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                    ⚠️ The tenant should change this password upon first login.
                                </div>
                            </div>

                            <Alert>
                                <AlertDescription className="text-sm">
                                    The tenant will receive these credentials via email. They can
                                    now log in and select their apartment unit.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!credentials ? (
                        <>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateAccount}
                                disabled={createAccountMut.isPending}
                            >
                                {createAccountMut.isPending ? 'Creating...' : 'Create Account'}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => onOpenChange(false)}>Done</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
