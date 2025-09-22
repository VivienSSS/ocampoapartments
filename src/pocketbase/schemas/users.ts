import z from 'zod';
import { UsersRoleOptions } from '../types';

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  emailVisibility: z.boolean().optional(),
  firstName: z.string().max(255),
  isActive: z.boolean().optional(),
  lastName: z.string().max(255),
  password: z.string().min(8, 'Minimum of 8 characters'),
  role: z.enum(UsersRoleOptions),
  tokenKey: z.string(),
  username: z.string(),
  verified: z.boolean().optional(),
  updated: z.date().optional(),
  created: z.date().optional(),
});

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

export const registerUserSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    password: true,
  })
  .extend({
    confirmPassword: z.string().min(8),
    acceptTOC: z.boolean(),
  });
