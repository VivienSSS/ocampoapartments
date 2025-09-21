import React from 'react';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { loginUserSchema } from '@/pocketbase/schemas/users';

const LoginForm = withForm({
  defaultValues: {} as z.infer<typeof loginUserSchema>,
  validators: {
    onChange: loginUserSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="email">
        {(field) => (
          <field.TextField type="email" placeholder="abc@email.com" />
        )}
      </form.AppField>
      <form.AppField name="password">
        {(field) => <field.TextField type="password" placeholder="*******" />}
      </form.AppField>
    </>
  ),
});

export default LoginForm;
