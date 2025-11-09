import { fieldConfig } from "@autoform/zod";
import z from 'zod';

export const inquirySchema = z.object({
    id: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    age: z.number().int().positive('Age must be a positive number'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    message: z.string().min(1, 'Message is required'),
    unitInterested: z.string().min(1, 'Unit interested is required'),
    numberOfOccupants: z.number().int().positive('Number of occupants must be a positive number'),
})