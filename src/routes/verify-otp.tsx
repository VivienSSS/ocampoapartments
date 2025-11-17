import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyOtpSchema, resendOtpSchema } from '@/pocketbase/schemas/otp';
import { verifyOtpMutation, resendOtpMutation, getOtpByInquiryQuery } from '@/pocketbase/queries/otp';
import { Collections, type InquiryResponse } from '@/pocketbase/types';
import { useRouteContext, useSearch, useNavigate, createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import z from 'zod';

interface VerifyOtpSearchParams {
    inquiryId: string;
}

export function VerifyOtpPage() {
    const { pocketbase, queryClient } = useRouteContext({ from: '/verify-otp' });
    const navigate = useNavigate();
    const { inquiryId } = useSearch({ from: '/verify-otp' }) as VerifyOtpSearchParams;
    const [otp, setOtp] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);

    // Fetch inquiry to display email
    const { data: inquiry, isLoading: inquiryLoading } = useQuery({
        queryKey: [Collections.Inquiry, inquiryId],
        queryFn: async () => {
            if (!inquiryId) return null;
            return pocketbase
                .collection(Collections.Inquiry)
                .getOne(inquiryId) as Promise<InquiryResponse>;
        },
        enabled: !!inquiryId,
    });

    // Fetch OTP details
    const { data: otpRecord, isLoading: otpLoading } = useQuery(
        getOtpByInquiryQuery(inquiryId || '')
    );

    // Verify OTP mutation
    const verifyMutation = useMutation(verifyOtpMutation);

    // Resend OTP mutation
    const resendMutation = useMutation(resendOtpMutation);

    // Check if OTP is expired
    const isExpired = otpRecord
        ? new Date() > new Date(otpRecord.expiresAt)
        : false;

    // Calculate time remaining
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    useEffect(() => {
        if (!otpRecord) return;

        const interval = setInterval(() => {
            const now = new Date();
            const expireTime = new Date(otpRecord.expiresAt);
            const diff = expireTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining('expired');
                clearInterval(interval);
            } else {
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [otpRecord]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        if (isExpired) {
            toast.error('OTP has expired. Please request a new one.');
            return;
        }

        try {
            await verifyMutation.mutateAsync({
                inquiryId: inquiryId || '',
                code: otp,
            });

            toast.success('Email verified successfully!');
            navigate({ to: '/' });
        } catch (error: any) {
            toast.error(error?.message || 'Verification failed. Please try again.');
            setAttemptCount((prev) => prev + 1);
        }
    };

    const handleResend = async () => {
        try {
            await resendMutation.mutateAsync({
                inquiryId: inquiryId || '',
            });

            setOtp('');
            setAttemptCount(0);
            await queryClient.refetchQueries({ queryKey: [Collections.Otp, inquiryId] });
            toast.success('OTP resent! Check your email.');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to resend OTP. Please try again.');
        }
    };

    if (inquiryLoading || otpLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!inquiryId || !inquiry) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <p className="text-red-600">Invalid inquiry ID. Please register again.</p>
                            <Button onClick={() => navigate({ to: '/register' })}>
                                Back to Registration
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a 6-digit OTP to {inquiry.email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 6) {
                                        setOtp(value);
                                    }
                                }}
                                disabled={isExpired || resendMutation.isPending}
                                className="text-center text-lg tracking-widest"
                            />
                        </div>

                        {isExpired && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                OTP has expired. Please request a new one.
                            </div>
                        )}

                        {!isExpired && timeRemaining && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-600">
                                OTP expires in {timeRemaining}
                            </div>
                        )}

                        {attemptCount > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-600">
                                Attempts remaining: {3 - attemptCount}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                isExpired ||
                                otp.length !== 6 ||
                                verifyMutation.isPending ||
                                resendMutation.isPending
                            }
                        >
                            {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleResend}
                            disabled={
                                isExpired ||
                                resendMutation.isPending ||
                                verifyMutation.isPending
                            }
                        >
                            {resendMutation.isPending ? 'Resending...' : 'Resend OTP'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>Didn&apos;t receive the code?</p>
                        <p>Check your spam folder or contact support</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export const Route = createFileRoute('/verify-otp')({
    component: VerifyOtpPage,
});
