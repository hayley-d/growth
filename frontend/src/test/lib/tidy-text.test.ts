import { expect, it } from "vitest";

import { tidyText } from "@/lib/tidy-text";

it("puts one space after each comma", () => {
  expect(tidyText("3,1, 2")).toBe("3, 1, 2");
  expect(tidyText("3 ,1 ,  2")).toBe("3, 1, 2");
});

it("trims the ends and collapses runs of spaces", () => {
  expect(tidyText("  in   order  ")).toBe("in order");
});

it("leaves an empty answer empty", () => {
  expect(tidyText("   ")).toBe("");
});
