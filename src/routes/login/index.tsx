import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import { loginUserMutation } from '@/pocketbase/queries/users';
import { loginUserSchema } from '@/pocketbase/schemas/users';
import LoginForm from './-form';

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
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <LoginForm form={form} />
          <form.SubmitButton>Sign in</form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
