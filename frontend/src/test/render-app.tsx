import { QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { vi } from "vitest";
import { render } from "vitest-browser-react";

import type { MeResponse } from "@shared/schemas";
import { authClient } from "@/lib/auth-client";
import { userQueryKeys } from "@/lib/queries/user.queries";
import { queryClient } from "@/lib/query-client";
import { routeTree } from "@/routeTree.gen";
import "@/index.css";

export const mockUser = {
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "student",
  banned: false,
  banReason: null,
  banExpires: null,
};

export const mockSession = {
  id: "test-session-id",
  token: "test-token",
  userId: mockUser.id,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  createdAt: new Date(),
  updatedAt: new Date(),
  ipAddress: null,
  userAgent: null,
  impersonatedBy: null,
};

type SessionData = { user: typeof mockUser; session: typeof mockSession } | null;

type SessionError = { message: string; status: number };

const defaultSessionData: SessionData = { user: mockUser, session: mockSession };

export const onboardedMe: MeResponse = {
  data: {
    user: { email: mockUser.email, emailVerified: true, displayName: mockUser.name },
    profile: {
      codeLanguageId: null,
      colourTheme: "default",
      learningStyleId: null,
      onboardingComplete: true,
      showOnLeaderboard: true,
      textToSpeech: false,
    },
  },
};

export function renderApp(
  path = "/",
  {
    session = defaultSessionData,
    sessionError,
    me = onboardedMe,
  }: { session?: SessionData; sessionError?: SessionError; me?: MeResponse | null } = {},
) {
  queryClient.clear();
  if (me) queryClient.setQueryData(userQueryKeys.me, me);
  vi.mocked(authClient.getSession).mockResolvedValue(
    sessionError ? { data: null, error: sessionError } : { data: session, error: null },
  );
  vi.mocked(authClient.signOut).mockResolvedValue({ data: null, error: null });

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { session },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
