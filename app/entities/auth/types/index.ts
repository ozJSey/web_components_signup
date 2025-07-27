import type { z } from "zod";
import type { signInSchema, storedUserSchema } from "~/entities/auth/types/validation-schemas";
// Ideally, we want to match the schamas to actual back-end input, however for this app this should just do.
export type SetUserInput = z.infer<typeof signInSchema>;
export type StoredUser = z.infer<typeof storedUserSchema>;