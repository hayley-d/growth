import { useState } from "react";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { codeLineHeight, codeListPadding } from "@/components/atoms/code-line";
import { CodeListing } from "@/components/molecules/code-listing";
import "@/index.css";

const lines = Array.from({ length: 40 }, (_, index) => `line ${index + 1}`);

it("puts the band on the current line", async () => {
  const screen = await render(<CodeListing lines={lines} currentLine={3} label="insert" />);
  const band = screen.getByTestId("current-line-band").element() as HTMLElement;
  const current = screen
    .getByRole("list", { name: "insert" })
    .element()
    .querySelector('[aria-current="step"]') as HTMLElement;

  expect(band.style.transform).toBe(`translateY(${codeListPadding + 2 * codeLineHeight}px)`);
  expect(current.offsetTop).toBe(codeListPadding + 2 * codeLineHeight);
  expect(current.offsetHeight).toBe(codeLineHeight);
});

function HiddenListing() {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsHidden(false)}>
        Show
      </button>
      <div hidden={isHidden}>
        <CodeListing lines={lines} currentLine={35} label="insert" />
      </div>
    </>
  );
}

it("scrolls to the current line once a hidden listing is shown", async () => {
  const screen = await render(<HiddenListing />);
  await screen.getByRole("button", { name: "Show" }).click();
  const listing = screen.getByRole("list", { name: "insert" });
  await expect.element(listing).toBeVisible();
  const box = listing.element().closest(".overflow-auto") as HTMLElement;

  await expect.poll(() => box.scrollTop).toBeGreaterThan(0);
});
