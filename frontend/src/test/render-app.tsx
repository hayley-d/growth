import { QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { vi } from "vitest";
import { render } from "vitest-browser-react";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { routeTree } from "@/routeTree.gen";
import "@/index.css";

const { mockUser, mockSession } = vi.hoisted(() => {
  const mockUser = {
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
  const mockSession = {
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
  return { mockUser, mockSession };
});

export { mockSession, mockUser };

type SessionData = { user: typeof mockUser; session: typeof mockSession } | null;

const defaultSessionData: SessionData = { user: mockUser, session: mockSession };

export function renderApp(path = "/", options?: { session?: SessionData }) {
  const sessionData = options?.session === undefined ? defaultSessionData : options.session;

  queryClient.clear();
  vi.mocked(authClient.getSession).mockResolvedValue({ data: sessionData, error: null });
  vi.mocked(authClient.signOut).mockResolvedValue({ data: null, error: null });

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { session: sessionData },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
