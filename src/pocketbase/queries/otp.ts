import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Collections, type OtpResponse } from "../types";
import { pb } from "..";
import type z from "zod";
import type { verifyOtpSchema, resendOtpSchema } from "../schemas/otp";

export const getOtpByInquiryQuery = (inquiryId: string) =>
    queryOptions({
        queryKey: [Collections.Otp, inquiryId],
        queryFn: async () => {
            const otpRecord = await pb
                .collection(Collections.Otp)
                .getFirstListItem(`inquiry = '${inquiryId}'`) as OtpResponse;
            return otpRecord;
        },
        enabled: !!inquiryId,
    });

export const verifyOtpMutation = mutationOptions({
    mutationFn: async (data: z.infer<typeof verifyOtpSchema>) => {
        // Get OTP record
        const otp = await pb
            .collection(Collections.Otp)
            .getFirstListItem(`inquiry = '${data.inquiryId}'`) as OtpResponse;

        // Check if expired
        const expiresAt = new Date(otp.expiresAt);
        if (new Date() > expiresAt) {
            throw new Error('OTP has expired. Please request a new one.');
        }

        // Check if code matches
        if (otp.code !== data.code) {
            // Increment attempt count
            await pb.collection(Collections.Otp).update(otp.id, {
                attemptCount: (otp.attemptCount || 0) + 1,
            });
            throw new Error('Invalid OTP code. Please try again.');
        }

        // Update OTP verification
        await pb.collection(Collections.Otp).update(otp.id, {
            verifiedAt: new Date().toISOString(),
        });

        // Update inquiry status to verified
        await pb.collection(Collections.Inquiry).update(data.inquiryId, {
            emailVerified: true,
            verifiedAt: new Date().toISOString(),
            status: 'verified',
        });

        return { success: true };
    },
});

export const resendOtpMutation = mutationOptions({
    mutationFn: async (data: z.infer<typeof resendOtpSchema>) => {
        // Get current OTP record
        const otp = await pb
            .collection(Collections.Otp)
            .getFirstListItem(`inquiry = '${data.inquiryId}'`) as OtpResponse;

        // Reset attempt count - Go hook will regenerate code and reset expiresAt
        await pb.collection(Collections.Otp).update(otp.id, {
            attemptCount: 0,
            hasSent: false, // Reset to trigger n8n again
        });

        return { success: true };
    },
});
