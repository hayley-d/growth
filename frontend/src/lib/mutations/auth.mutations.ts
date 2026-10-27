import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "@/lib/queries/auth.queries";
import { authService } from "@/services/auth-service";

export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signInWithEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authQueryKeys.session }),
  });
};

export const useSignUpMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signUpWithEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authQueryKeys.session }),
  });
};

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signOutUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authQueryKeys.session }),
  });
};
