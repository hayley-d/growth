import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "@/lib/queries/auth.queries";
import { authService } from "@/services/auth-service";

const useSessionMutation = <Variables>(mutationFn: (variables: Variables) => Promise<void>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authQueryKeys.session }),
  });
};

export const useSignInMutation = () => useSessionMutation(authService.signInWithEmail);

export const useSignUpMutation = () => useSessionMutation(authService.signUpWithEmail);

export const useSignOutMutation = () => useSessionMutation(authService.signOutUser);
