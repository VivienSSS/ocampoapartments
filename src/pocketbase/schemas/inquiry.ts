import { fieldConfig } from "@autoform/zod";
import z from 'zod';

export const inquirySchema = z.object({
    id: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    age: z.number().int().positive('Age must be a positive number'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    message: z.string().optional(),
    unitInterested: z.string().min(1, 'Unit interested is required'),
    numberOfOccupants: z.number().int().positive('Number of occupants must be a positive number'),
    qr_image_proof: z.instanceof(File, { error: 'QR code image Required' }).optional(),
    submission_type: z.string().min(1, 'Submission type is required').optional(),
    status: z.enum(['pending', 'verified', 'approved', 'rejected']),
    emailVerified: z.boolean(),
    verifiedAt: z.date().optional(),
    rejectionReason: z.string().optional(),
    approval_status: z.enum(['pending', 'approved', 'rejected']).optional(),
    approval_notes: z.string().optional(),
    rejection_reason: z.string().optional(),
    created: z.date().optional(),
    updated: z.date().optional(),
})

export const insertInquirySchema = inquirySchema.omit({
    id: true,
    created: true,
    updated: true,
    status: true,
    emailVerified: true,
    verifiedAt: true,
});

export const updateInquiryStatusSchema = z.object({
    inquiryId: z.string(),
    status: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
});

export const approveInquirySchema = z.object({
    inquiryId: z.string(),
    approval_notes: z.string().optional(),
});

export const rejectInquirySchema = z.object({
    inquiryId: z.string(),
    rejection_reason: z.string().min(1, 'Rejection reason is required'),
});

export const createAccountSchema = z.object({
    inquiryId: z.string(),
    approval_notes: z.string().optional(),
});