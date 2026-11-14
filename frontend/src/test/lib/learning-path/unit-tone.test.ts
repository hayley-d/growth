import { expect, it } from "vitest";

import { unitTone } from "@/lib/learning-path/unit-tone";

it("uses pink for the first unit and yellow for the rest", () => {
  expect(unitTone(1)).toBe("secondary");
  expect(unitTone(2)).toBe("accent");
  expect(unitTone(3)).toBe("accent");
});
