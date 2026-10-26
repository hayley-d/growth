import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { ColourSchemePicker } from "@/components/molecules/colour-scheme-picker";

it("shows every scheme with the current one checked", async () => {
  const screen = await render(<ColourSchemePicker value="okabe-ito" onChange={vi.fn()} />);

  await expect.element(screen.getByRole("radio", { name: /Default/ })).not.toBeChecked();
  await expect.element(screen.getByRole("radio", { name: /High contrast/ })).not.toBeChecked();
  await expect.element(screen.getByRole("radio", { name: /Colour-blind friendly/ })).toBeChecked();
});

it("reports the scheme a learner picks", async () => {
  const onChange = vi.fn();
  const screen = await render(<ColourSchemePicker value="default" onChange={onChange} />);

  await screen.getByText("High contrast").click();

  expect(onChange).toHaveBeenCalledWith("high-contrast");
});
