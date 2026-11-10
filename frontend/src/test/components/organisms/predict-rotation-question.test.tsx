import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { AvlNode } from "@shared/avl";
import { PredictRotationQuestion } from "@/components/organisms/predict-rotation-question";
import "@/index.css";

const leaning: AvlNode = {
  key: 30,
  height: 2,
  right: null,
  left: { key: 20, height: 1, left: null, right: null },
};

const renderQuestion = (onSubmit = vi.fn()) =>
  render(
    <div className="w-96">
      <PredictRotationQuestion root={leaning} onSubmit={onSubmit} />
    </div>,
  );

it("submits the pivot and the rotation", async () => {
  const onSubmit = vi.fn();
  const screen = await renderQuestion(onSubmit);

  await screen.getByRole("button", { name: /^30,/ }).click();
  await expect.element(screen.getByText("Pivot: 30")).toBeVisible();
  await screen.getByRole("radio", { name: "Left, then right" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenCalledWith({
    type: "predict_rotation",
    rotation: "leftRight",
    pivotKey: 30,
  });
});

it("clears the pivot when it is tapped again", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: /^30,/ }).click();
  await screen.getByRole("button", { name: /^30,/ }).click();

  await expect.element(screen.getByText("Pivot: tap a node on the tree")).toBeVisible();
});

it("shows no pivot once no rotation is chosen, and a tap on a node undoes that choice", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: /^30,/ }).click();
  await screen.getByRole("radio", { name: "No rotation" }).click();
  await expect.element(screen.getByText(/Pivot: none/)).toBeVisible();

  await screen.getByRole("button", { name: /^20,/ }).click();
  await expect.element(screen.getByText("Pivot: 20")).toBeVisible();
  await expect.element(screen.getByRole("radio", { name: "No rotation" })).not.toBeChecked();
});

it("needs a pivot for a rotation but not for no rotation", async () => {
  const onSubmit = vi.fn();
  const screen = await renderQuestion(onSubmit);

  await screen.getByRole("radio", { name: "Right" }).click();
  await expect.element(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("radio", { name: "No rotation" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenCalledWith({
    type: "predict_rotation",
    rotation: "none",
    pivotKey: null,
  });
});
