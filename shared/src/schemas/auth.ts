import { z } from "zod";

export const signInRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const signUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1, "Display name is required"),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export const sessionResponseSchema = z
  .object({
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.email(),
      role: z.string().nullish(),
    }),
    session: z.object({
      id: z.string(),
      expiresAt: z.coerce.date(),
    }),
  })
  .nullable();

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
