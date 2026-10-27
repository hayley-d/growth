import type { SignInRequest, SignUpRequest } from "@shared/schemas/auth";
import { authClient } from "@/lib/auth-client";
import { ServiceError } from "@/services/service-error";

export const getSession = async () => {
  const { data, error } = await authClient.getSession();
  if (error) throw new ServiceError(error.message ?? "Unable to fetch session", error.status);
  return data;
};

export const signInWithEmail = async ({ email, password }: SignInRequest) => {
  const { data, error } = await authClient.signIn.email({ email, password });
  if (error) throw new ServiceError(error.message ?? "Unable to sign in", error.status);
  return data;
};

export const signUpWithEmail = async ({ email, password, name }: SignUpRequest) => {
  const resolvedName = name?.trim() || (email.split("@")[0] ?? email);
  const { data, error } = await authClient.signUp.email({ email, password, name: resolvedName });
  if (error) throw new ServiceError(error.message ?? "Unable to sign up", error.status);
  return data;
};

export const signOutUser = async () => {
  const { error } = await authClient.signOut();
  if (error) throw new ServiceError(error.message ?? "Unable to sign out", error.status);
};

export const authService = {
  getSession,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
};
