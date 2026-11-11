import { expect, it } from "vitest";

import { unitTone } from "@/lib/learning-path/unit-tone";

it("uses primary for the first unit and secondary for the rest", () => {
  expect(unitTone(1)).toBe("primary");
  expect(unitTone(2)).toBe("secondary");
  expect(unitTone(3)).toBe("secondary");
});
