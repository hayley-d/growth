import { hashKey } from "@tanstack/react-query";

import type { SessionResponse } from "@shared/schemas";
import { applyColourScheme } from "@/lib/colour-schemes";
import { authQueryKeys } from "@/lib/queries/auth.queries";
import { meQueryOptions, userQueryKeys } from "@/lib/queries/user.queries";
import { queryClient } from "@/lib/query-client";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";

const sessionQueryHash = hashKey(authQueryKeys.session);

export function syncColourScheme() {
  applyColourScheme(useColourSchemeStore.getState().colourScheme);
  const stopStore = useColourSchemeStore.subscribe((state) =>
    applyColourScheme(state.colourScheme),
  );

  let signedInUserId: string | undefined;
  const stopSession = queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "updated" || event.action.type !== "success") return;
    if (event.query.queryHash !== sessionQueryHash) return;
    const userId = (event.query.state.data as SessionResponse | undefined)?.user.id;
    if (userId === signedInUserId) return;
    signedInUserId = userId;
    queryClient.removeQueries({ queryKey: userQueryKeys.me });
    if (!userId) return;
    queryClient.fetchQuery(meQueryOptions).then(
      (response) => {
        if (signedInUserId !== userId) return;
        useColourSchemeStore.getState().setColourScheme(response.data.profile.colourTheme);
      },
      () => undefined,
    );
  });

  return () => {
    stopStore();
    stopSession();
  };
}
