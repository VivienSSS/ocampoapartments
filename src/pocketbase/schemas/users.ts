import { fieldConfig } from '@autoform/zod';
import z from 'zod';
import { UsersRoleOptions } from '../types';

export const userSchema = z.object({
  id: z.string(),
  email: z.email('Please enter a valid email address'),
  emailVisibility: z.boolean().optional(),
  firstName: z
    .string()
    .nonempty('First name is required')
    .max(255, 'First name must not exceed 255 characters'),
  isActive: z.boolean().optional(),
  lastName: z
    .string()
    .nonempty('Last name is required')
    .max(255, 'Last name must not exceed 255 characters'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  role: z.enum(UsersRoleOptions, { message: 'Please select a valid role' }),
  tokenKey: z.string().nonempty('Token key is required'),
  username: z.string().nonempty('Username is required'),
  verified: z.boolean().optional(),
  updated: z.date().optional(),
  created: z.date().optional(),
});

export const loginUserSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    password: z
      .string()
      .nonempty('Password is required')
      .check(fieldConfig({ inputProps: { type: 'password' } })),
  });

export const registerUserSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    password: true,
  })
  .extend({
    confirmPassword: z
      .string()
      .nonempty('Confirm password is required')
      .min(8, 'Confirm password must be at least 8 characters'),
    acceptTOC: z.boolean(),
  });
