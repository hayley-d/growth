import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "@/lib/queries/auth.queries";
import { userQueryKeys } from "@/lib/queries/user.queries";
import { authService } from "@/services/auth-service";
import { userService } from "@/services/user-service";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (response) => queryClient.setQueryData(userQueryKeys.me, response),
  });
};

export const useUpdateDisplayNameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.updateDisplayName,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.session }),
        queryClient.invalidateQueries({ queryKey: userQueryKeys.me }),
      ]),
  });
};
