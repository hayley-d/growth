import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render } from "vitest-browser-react";

import { routeTree } from "@/routeTree.gen";
import "@/index.css";

export function renderApp(path = "/") {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  return render(<RouterProvider router={router} />);
}
