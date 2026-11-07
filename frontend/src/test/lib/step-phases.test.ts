import { expect, it } from "vitest";

import { phaseLabel, phaseOf } from "@/lib/step-phases";

it("puts each step in the phase of its algorithm", () => {
  expect(phaseOf("insert.go-left")).toBe("walk");
  expect(phaseOf("search.found")).toBe("walk");
  expect(phaseOf("update-height.compute-height")).toBe("height");
  expect(phaseOf("rebalance.case-left-right")).toBe("rebalance");
  expect(phaseOf("rotate-right.check-pivot")).toBe("rotate");
  expect(phaseOf("rotate-left.check-pivot")).toBe("rotate");
});

it("names each phase", () => {
  expect(phaseLabel("height")).toBe("Update height");
});
