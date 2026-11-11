import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { CodeTraceBlock } from "@/components/organisms/code-trace-block";
import "@/index.css";

vi.mock("@/services/network.service", () => ({
  networkService: { get: vi.fn(() => new Promise(() => {})) },
}));

const renderBlock = (showCode?: boolean) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CodeTraceBlock
        algorithmCode="preorder"
        startingKeys={[20, 10, 30, 5]}
        operation={{ operation: "traverse" }}
        showCode={showCode}
      />
    </QueryClientProvider>,
  );

it("shows the tree and the call stack without the code when showCode is false", async () => {
  const screen = await renderBlock(false);

  await expect.element(screen.getByRole("heading", { name: "Call stack" })).toBeVisible();
  await expect.element(screen.getByText("preorder(20)")).toBeVisible();
  expect(screen.container.querySelector('[role="tablist"]')).toBeNull();

  await screen.getByRole("button", { name: "Forward one step" }).click();
  await screen.getByRole("button", { name: "Forward one step" }).click();
  await screen.getByRole("button", { name: "Forward one step" }).click();
  await expect.element(screen.getByText("preorder(10)")).toBeVisible();
});
