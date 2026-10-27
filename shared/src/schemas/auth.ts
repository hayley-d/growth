import { z } from "zod";

export const signInRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const signUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
