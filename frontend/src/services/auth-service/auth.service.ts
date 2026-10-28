import {
  type SessionResponse,
  type SignInRequest,
  type SignUpRequest,
  sessionResponseSchema,
} from "@shared/schemas/auth";
import { authClient } from "@/lib/auth-client";
import { rejectInvalidResponse, ServiceError } from "@/services/service-error";

type AuthClientError = { message?: string | null; status: number } | null;

const throwIfError = (error: AuthClientError, fallbackMessage: string) => {
  if (error) throw new ServiceError(error.message || fallbackMessage, error.status);
};

export const getSession = async (): Promise<SessionResponse> => {
  const { data, error } = await authClient.getSession();
  throwIfError(error, "Unable to fetch session");

  const parsedData = sessionResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const signInWithEmail = async ({ email, password }: SignInRequest): Promise<void> => {
  const { error } = await authClient.signIn.email({ email, password });
  throwIfError(error, "Unable to sign in");
};

export const signUpWithEmail = async ({ email, password, name }: SignUpRequest): Promise<void> => {
  const { error } = await authClient.signUp.email({ email, password, name: name.trim() });
  throwIfError(error, "Unable to sign up");
};

export const signOutUser = async (): Promise<void> => {
  const { error } = await authClient.signOut();
  throwIfError(error, "Unable to sign out");
};

export const authService = {
  getSession,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
};
