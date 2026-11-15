import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { TreeTools } from "@/components/molecules/tree-tools";

it("only shows the tools it is given", async () => {
  const screen = await render(<TreeTools busy={false} codeHidden={false} onToggleCode={vi.fn()} />);

  await expect.element(screen.getByRole("button", { name: "Hide code" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "New tree" })).not.toBeInTheDocument();
  await expect.element(screen.getByRole("button", { name: "Clear" })).not.toBeInTheDocument();
});

it("runs each tool and blocks the tree tools while busy", async () => {
  const onNewTree = vi.fn();
  const onClear = vi.fn();
  const onToggleCode = vi.fn();
  const screen = await render(
    <TreeTools
      busy={false}
      codeHidden
      onToggleCode={onToggleCode}
      onNewTree={onNewTree}
      onClear={onClear}
    />,
  );

  await screen.getByRole("button", { name: "New tree" }).click();
  await screen.getByRole("button", { name: "Clear" }).click();
  await screen.getByRole("button", { name: "Show code" }).click();
  expect(onNewTree).toHaveBeenCalledOnce();
  expect(onClear).toHaveBeenCalledOnce();
  expect(onToggleCode).toHaveBeenCalledOnce();

  screen.rerender(
    <TreeTools
      busy
      codeHidden
      onToggleCode={onToggleCode}
      onNewTree={onNewTree}
      onClear={onClear}
    />,
  );

  await expect.element(screen.getByRole("button", { name: "New tree" })).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Show code" })).toBeEnabled();
});
