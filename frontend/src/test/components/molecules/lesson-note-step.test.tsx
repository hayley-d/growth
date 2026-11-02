import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { LessonNoteStep } from "@/components/molecules/lesson-note-step";

const prompt = "What does a rotation fix?";
const patient = { timeout: 4000 };

it("shows the prompt, the saved note and the character count", async () => {
  const screen = await render(
    <LessonNoteStep prompt={prompt} savedBody="my words" onSave={vi.fn()} />,
  );

  await expect
    .element(screen.getByRole("heading", { name: "Explain it in your own words" }))
    .toBeVisible();
  await expect.element(screen.getByRole("textbox", { name: prompt })).toHaveValue("my words");
  await expect.element(screen.getByText("8 / 2000")).toBeVisible();
});

it("saves after typing stops and shows Saved", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const screen = await render(<LessonNoteStep prompt={prompt} savedBody="" onSave={onSave} />);

  await screen.getByRole("textbox", { name: prompt }).fill("balance");

  await expect.element(screen.getByText("Saved"), patient).toBeVisible();
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave).toHaveBeenCalledWith("balance");
});

it("shows an error and keeps the text when the save fails", async () => {
  const onSave = vi.fn().mockRejectedValue(new Error("offline"));
  const screen = await render(<LessonNoteStep prompt={prompt} savedBody="" onSave={onSave} />);

  await screen.getByRole("textbox", { name: prompt }).fill("balance");

  await expect
    .element(screen.getByText("Could not save. Your note is still here."), patient)
    .toBeVisible();
  await expect.element(screen.getByRole("textbox", { name: prompt })).toHaveValue("balance");
});

it("does not save when nothing changed", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const screen = await render(<LessonNoteStep prompt={prompt} savedBody="same" onSave={onSave} />);

  await screen.getByRole("textbox", { name: prompt }).click();
  await screen.getByRole("textbox", { name: prompt }).element().blur();

  expect(onSave).not.toHaveBeenCalled();
});
