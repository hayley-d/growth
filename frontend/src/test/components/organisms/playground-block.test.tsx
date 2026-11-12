import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { PlaygroundBlock } from "@/components/organisms/playground-block";
import { TreeModeProvider } from "@/lib/lesson/tree-mode";
import "@/index.css";

it("fills a beat for each right tap and crosses out wrong ones above it", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8, 4, 12]}
      allowedOperations={["traverse"]}
      instructions="Tap the nodes in pre-order."
      goal={{ kind: "traversal", order: "preorder", keys: [8, 4, 12] }}
    />,
  );

  await expect.element(screen.getByText("Tap the nodes in pre-order.")).toBeVisible();
  await screen.getByRole("button", { name: /^8,/ }).click();
  await expect.element(screen.getByText("8 is right. Tap the node for beat 2.")).toBeVisible();

  await screen.getByRole("button", { name: /^12,/ }).click();
  await expect
    .element(screen.getByText("Not 12. Beat 2 is still open, try another node."))
    .toBeVisible();
  await expect.element(screen.getByText("12 was wrong", { exact: false })).toBeInTheDocument();

  await screen.getByRole("button", { name: /^4,/ }).click();
  await screen.getByRole("button", { name: /^12,/ }).click();
  await expect
    .element(screen.getByText("That's the whole pre-order order: 8, 4, 12."))
    .toBeVisible();

  await screen.getByRole("button", { name: "Start again" }).click();
  await expect.element(screen.getByText("Tap the first node in pre-order.")).toBeVisible();
});

it("expects a pre-order walk when a traversal step has no goal", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8, 4, 12]}
      allowedOperations={["traverse"]}
      instructions="Tap the nodes."
    />,
  );

  await screen.getByRole("button", { name: /^8,/ }).click();
  await expect.element(screen.getByText("8 is right. Tap the node for beat 2.")).toBeVisible();
});

it("runs typed commands in the console and shows the goal once the run ends", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8]}
      allowedOperations={["insert"]}
      instructions="Insert 4 and 12."
      goal={{ kind: "containsKeys", keys: [8, 4, 12] }}
    />,
  );
  const command = screen.getByLabelText("Command");

  await command.fill("insert 4 12");
  await screen.getByRole("button", { name: "Run" }).click();
  await expect
    .element(screen.getByText("Step through to watch 4 and 12 go in.").first())
    .toBeVisible();
  expect(screen.container.textContent).not.toContain("Goal reached");

  await screen.getByRole("button", { name: "Last step" }).click();
  await expect
    .element(screen.getByText("Goal reached. Every key is where it belongs."))
    .toBeVisible();
});

it("suggests the next goal key", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8]}
      allowedOperations={["insert"]}
      instructions="Insert 4 and 12."
      goal={{ kind: "containsKeys", keys: [8, 4, 12] }}
    />,
  );

  await expect.element(screen.getByRole("button", { name: "insert 4" })).toBeVisible();
});

it("refuses commands the step doesn't allow", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8]}
      allowedOperations={["insert"]}
      instructions="Build a tree."
    />,
  );

  await screen.getByLabelText("Command").fill("delete 8");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect.element(screen.getByRole("alert")).toHaveTextContent("Here you can use insert n.");
});

it("answers help with the commands the step allows", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8]}
      allowedOperations={["insert"]}
      instructions="Build a tree."
    />,
  );

  await screen.getByLabelText("Command").fill("help");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect
    .element(screen.getByRole("status").filter({ hasText: "Here you can use insert n." }))
    .toBeVisible();
  await expect.element(screen.getByRole("alert")).not.toBeInTheDocument();
});

it("starts again from the starting tree", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[]}
      allowedOperations={["insert"]}
      instructions="Build a tree."
    />,
  );
  await expect.element(screen.getByText("The tree is empty.")).toBeVisible();

  await screen.getByLabelText("Command").fill("insert 5");
  await screen.getByRole("button", { name: "Run" }).click();
  await expect.element(screen.getByRole("button", { name: "Last step" })).toBeVisible();

  await screen.getByRole("button", { name: "Start again" }).click();
  await expect.element(screen.getByText("The tree is empty.")).toBeVisible();
});

it("in a bst lesson, inserts without balancing or rotating", async () => {
  const screen = await render(
    <TreeModeProvider mode="bst">
      <PlaygroundBlock
        startingKeys={[8]}
        allowedOperations={["insert"]}
        instructions="Insert your own keys."
      />
    </TreeModeProvider>,
  );

  await screen.getByLabelText("Command").fill("insert 4 2");
  await screen.getByRole("button", { name: "Run" }).click();
  await screen.getByRole("button", { name: "Last step" }).click();

  const text = screen.container.textContent ?? "";
  expect(text).not.toMatch(/balance|rotat|height/i);
  await expect
    .element(screen.getByRole("list", { name: "Key" }))
    .toHaveTextContent("Walk the tree");
  expect(screen.getByRole("list", { name: "Key" }).element().textContent).not.toMatch(
    /Rebalance|Rotate|Update height/,
  );
});

it("refuses avl-only commands with the commands the step allows", async () => {
  const screen = await render(
    <PlaygroundBlock
      startingKeys={[8]}
      allowedOperations={["insert"]}
      instructions="Build a tree."
    />,
  );

  await screen.getByLabelText("Command").fill("rotate left 8");
  await screen.getByRole("button", { name: "Run" }).click();

  await expect.element(screen.getByRole("alert")).toHaveTextContent("Here you can use insert n.");
});
