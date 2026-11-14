import { hashKey } from "@tanstack/react-query";

import type { SessionResponse } from "@shared/schemas";
import { authQueryKeys } from "@/lib/queries/auth.queries";
import { queryClient } from "@/lib/query-client";

const sessionQueryHash = hashKey(authQueryKeys.session);

// Everything cached apart from the session belongs to whoever was signed in.
// When that learner signs out, or another one signs in, drop it so nobody sees
// someone else's progress, daily challenge or practice results.
export function clearCacheOnUserSwitch() {
  let signedInUserId: string | undefined;

  return queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "updated" || event.action.type !== "success") return;
    if (event.query.queryHash !== sessionQueryHash) return;
    const userId = (event.query.state.data as SessionResponse | null | undefined)?.user.id;
    if (userId === signedInUserId) return;
    const previousUserId = signedInUserId;
    signedInUserId = userId;
    if (previousUserId === undefined) return;
    queryClient.resetQueries({ predicate: (query) => query.queryHash !== sessionQueryHash });
  });
}
