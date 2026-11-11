import { expect, it } from "vitest";

import { countCompleted } from "@/lib/learning-path/count-completed";

it("counts only completed lessons", () => {
  expect(
    countCompleted([
      { status: "completed" },
      { status: "completed" },
      { status: "current" },
      { status: "locked" },
    ]),
  ).toBe(2);
  expect(countCompleted([])).toBe(0);
});
