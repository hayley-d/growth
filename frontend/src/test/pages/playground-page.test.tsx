import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { algorithmService } from "@/services/algorithm-service";
import { ServiceError } from "@/services/service-error";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/algorithm-service", () => ({
  algorithmService: { getAlgorithmSnippet: vi.fn() },
}));

beforeEach(() => {
  vi.mocked(algorithmService.getAlgorithmSnippet).mockRejectedValue(
    new ServiceError("There's no code for this yet", 404),
  );
});

it("sends an unfinished setup back to the setup page", async () => {
  const screen = await renderApp("/playground/play?topic=avl");

  await expect.element(screen.getByLabelText("What topic?")).toHaveTextContent("Tree building");
});

it("runs a typed command and steps through it", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=watch&start=empty&seed=2");

  await screen.getByRole("textbox", { name: "Command" }).fill("insert 42");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect
    .element(screen.getByRole("status").filter({ hasText: "Step through to watch 42 go in." }))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Run insert 42 again" })).toBeVisible();
});

it("blocks a command outside the setup", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=watch&start=small&seed=2");

  await screen.getByRole("textbox", { name: "Command" }).fill("inorder");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("inorder is a traversal. Use Change setup to play with traversals.");
});

it("checks a walk prediction made by tapping nodes", async () => {
  const screen = await renderApp(
    "/playground/play?topic=traversal&traversal=inorder&explore=interact&start=small&seed=2",
  );

  const nodes = screen.getByRole("button", { name: /balance factor/ });
  await expect.element(nodes.first()).toBeVisible();
  const names = nodes.elements().map((node) => node.getAttribute("aria-label") ?? "");
  const keys = names.map((name) => Number.parseInt(name, 10)).sort((left, right) => left - right);
  for (const key of keys) {
    await screen.getByRole("button", { name: new RegExp(`^${key}, balance factor`) }).click();
  }
  await screen.getByRole("button", { name: "Check, then watch" }).click();

  await expect
    .element(screen.getByRole("status").filter({ hasText: "Right, every place matches." }))
    .toBeVisible();
});

it("deletes the picked node with a button", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=interact&start=small&seed=2");

  const node = screen.getByRole("button", { name: /balance factor/ }).first();
  const key = Number.parseInt((await node.element().getAttribute("aria-label")) ?? "", 10);
  await node.click();
  await screen.getByRole("button", { name: `Delete ${key}` }).click();

  await expect
    .element(
      screen.getByRole("status").filter({ hasText: `Step through to watch ${key} come out.` }),
    )
    .toBeVisible();
});

it("drops the picked node when a replay removes it", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=interact&start=small&seed=2");

  const node = screen.getByRole("button", { name: /balance factor/ }).first();
  const key = Number.parseInt((await node.element().getAttribute("aria-label")) ?? "", 10);
  await node.click();
  await screen.getByRole("button", { name: `Delete ${key}` }).click();

  await screen.getByLabelText("New key").fill(String(key));
  await screen.getByRole("button", { name: new RegExp(`^Key ${key}\\.`) }).click();
  await screen.getByRole("button", { name: "Last step" }).click();
  await screen.getByRole("button", { name: new RegExp(`^${key},.*balance factor`) }).click();
  await expect.element(screen.getByRole("button", { name: `Delete ${key}` })).toBeVisible();

  await screen.getByRole("button", { name: `Run delete ${key} again` }).click();

  await expect
    .element(screen.getByRole("button", { name: `Delete ${key}` }))
    .not.toBeInTheDocument();
});

it("only offers New tree for an empty tree in a hands-on traversal", async () => {
  const screen = await renderApp(
    "/playground/play?topic=traversal&traversal=inorder&explore=interact&start=empty&seed=2",
  );

  await expect
    .element(screen.getByText("The tree is empty. Press New tree to start."))
    .toBeVisible();
});

it("hides the code so the tree has the whole card", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=watch&start=small&seed=2");

  await screen.getByRole("button", { name: "Hide code" }).click();

  await expect.element(screen.getByRole("button", { name: "Show code" })).toBeVisible();
  await expect.element(screen.getByRole("region", { name: "Code" })).not.toBeInTheDocument();
});

it("reads a step out loud with Listen", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=watch&start=empty&seed=2");

  await screen.getByRole("textbox", { name: "Command" }).fill("insert 42");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect.element(screen.getByRole("button", { name: "Listen to this step" })).toBeVisible();
});

it("explains the hands-on controls in info tips", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=interact&start=small&seed=2");

  await expect
    .element(screen.getByRole("button", { name: "How to add the new node" }))
    .toBeVisible();
  await screen.getByRole("button", { name: "About auto-balance" }).click();
  await expect
    .element(screen.getByRole("tooltip"))
    .toHaveTextContent("Turn auto-balance off to rotate by hand.");
});

it("only lets two digits into the new key box", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=interact&start=empty&seed=2");

  const box = screen.getByRole("textbox", { name: "New key" });
  await box.fill("aaaaaaa");
  await expect.element(box).toHaveValue("");

  await box.fill("123");
  await expect.element(box).toHaveValue("12");
});

it("keeps a key the learner types even when it's already in the tree", async () => {
  const screen = await renderApp("/playground/play?topic=avl&explore=interact&start=small&seed=2");

  const node = screen.getByRole("button", { name: /balance factor/ }).first();
  const key = Number.parseInt((await node.element().getAttribute("aria-label")) ?? "", 10);
  const box = screen.getByRole("textbox", { name: "New key" });
  await box.fill(String(key));

  await expect.element(box).toHaveValue(String(key));
});

it("shows the message above the tree and lets the learner zoom", async () => {
  await page.viewport(1280, 900);
  const screen = await renderApp("/playground/play?topic=avl&explore=watch&start=small&seed=2");

  await screen.getByRole("textbox", { name: "Command" }).fill("insert 33");
  await screen.getByRole("button", { name: "Run" }).click();
  const notice = screen.getByRole("status").filter({ hasText: "Step through to watch 33 go in." });
  const tree = screen.getByRole("img", { name: "Tree" });
  await expect.element(notice).toBeVisible();
  const noticeTop = notice.element().getBoundingClientRect().top;
  expect(noticeTop).toBeLessThan(tree.element().getBoundingClientRect().top);
  const column = screen.getByRole("region", { name: "Tree" }).element();
  expect(noticeTop - column.getBoundingClientRect().top).toBeLessThan(40);

  await screen.getByRole("button", { name: "Zoom in" }).click();
  await expect.element(screen.getByText("150%")).toBeVisible();
});
