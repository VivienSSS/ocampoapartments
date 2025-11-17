import z from 'zod';

export const otpSchema = z.object({
    id: z.string(),
    inquiry: z.string().nonempty('Inquiry is required'),
    code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
    expiresAt: z.date(),
    hasSent: z.boolean(),
    sentAt: z.date().optional(),
    verifiedAt: z.date().optional(),
    attemptCount: z.number().int().nonnegative(),
    created: z.date().optional(),
    updated: z.date().optional(),
});

export const insertOtpSchema = otpSchema.omit({
    id: true,
    created: true,
    updated: true,
});

export const verifyOtpSchema = z.object({
    inquiryId: z.string(),
    code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export const resendOtpSchema = z.object({
    inquiryId: z.string(),
});
