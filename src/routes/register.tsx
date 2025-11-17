import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppForm } from '@/components/ui/forms';
import { insertInquirySchema } from '@/pocketbase/schemas/inquiry';
import { registerInquiryMutation } from '@/pocketbase/queries/inquries';
import { Collections } from '@/pocketbase/types';
import { useRouteContext, createFileRoute } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import z from 'zod';

const MutationSchema = insertInquirySchema;

export function RegisterPage() {
    const { pocketbase, queryClient } = useRouteContext({ from: '/register' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useAppForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            age: undefined,
            email: '',
            phone: '',
            numberOfOccupants: undefined,
            unitInterested: '',
            message: '',
            submission_type: undefined,
        } as unknown as z.infer<typeof MutationSchema>,
        // validators: { onSubmit: MutationSchema },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                const inquiry = await pocketbase
                    .collection(Collections.Inquiry)
                    .create({
                        ...value,
                        status: 'pending',
                        emailVerified: false,
                    });

                // Redirect to OTP verification page
                toast.success('Registration successful! Check your email for OTP.');
                navigate({
                    to: '/verify-otp',
                    search: { inquiryId: inquiry.id },
                });
            } catch (error: any) {
                if (error?.response?.message?.includes('email')) {
                    toast.error('An inquiry with this email already exists. Please verify your email or contact support');
                } else {
                    toast.error(error?.message || 'Failed to register. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Register as Tenant</CardTitle>
                    <CardDescription>
                        Create your inquiry to apply for an apartment unit
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <form.AppForm>
                            <div className="grid grid-cols-2 gap-4">
                                <form.AppField name="firstName">
                                    {(field) => (
                                        <field.TextField
                                            label="First Name"
                                            placeholder="Juan"
                                        />
                                    )}
                                </form.AppField>
                                <form.AppField name="lastName">
                                    {(field) => (
                                        <field.TextField
                                            label="Last Name"
                                            placeholder="Dela Cruz"
                                        />
                                    )}
                                </form.AppField>

                                <form.AppField name="age">
                                    {(field) => (
                                        <field.NumberField
                                            label="Age"
                                            placeholder="25"
                                        />
                                    )}
                                </form.AppField>

                                <form.AppField name="phone">
                                    {(field) => (
                                        <field.TextField
                                            label="Phone"
                                            placeholder="+63 912 345 6789"
                                        />
                                    )}
                                </form.AppField>

                                <div className="col-span-2">
                                    <form.AppField name="email">
                                        {(field) => (
                                            <field.TextField
                                                type="email"
                                                label="Email"
                                                placeholder="juan@example.com"
                                            />
                                        )}
                                    </form.AppField>
                                </div>

                                <form.AppField name="numberOfOccupants">
                                    {(field) => (
                                        <field.NumberField
                                            label="Number of Occupants"
                                            placeholder="4"
                                        />
                                    )}
                                </form.AppField>

                                <div className="col-span-2">
                                    <form.AppField name="message">
                                        {(field) => (
                                            <field.TextareaField
                                                label="Message (Optional)"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        )}
                                    </form.AppField>
                                </div>
                            </div>
                        </form.AppForm>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>Already have an inquiry?</p>
                        <a href="/login" className="text-primary hover:underline">
                            Sign in to your account
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export const Route = createFileRoute('/register')({
    component: RegisterPage,
});
