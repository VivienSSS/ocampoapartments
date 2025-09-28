import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import { loginUserMutation } from '@/pocketbase/queries/users';
import { loginUserSchema } from '@/pocketbase/schemas/users';
import { LoginForm } from '@/components/login-form';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  beforeLoad: () => {
    if (pb.authStore.isValid) {
      throw redirect({ to: '/dashboard/announcements' }); // for fail
    }
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const loginMutation = useMutation(loginUserMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof loginUserSchema>,
    validators: {
      onChange: loginUserSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);

      navigate({ to: '/dashboard/announcements' }); //for success
    },
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a> */}
        <LoginForm />
      </div>
    </div>
  );
}
