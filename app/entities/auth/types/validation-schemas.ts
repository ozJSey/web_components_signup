import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    department: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    subscribeToUpdates: z.boolean().optional(),
  });

export const storedUserSchema = signInSchema.extend({
  userId: z.string(),
  createdAt: z.date(),
});