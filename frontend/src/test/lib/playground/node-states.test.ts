import { describe, expect, it } from "vitest";

import { withUnbalanced } from "@/lib/playground/node-states";

describe("withUnbalanced", () => {
  it("flags unbalanced keys that have no state or were only visited", () => {
    expect(withUnbalanced({ 10: "visited" }, [10, 20])).toEqual({
      10: "unbalanced",
      20: "unbalanced",
    });
  });

  it("keeps a state that says more than visited", () => {
    expect(withUnbalanced({ 10: "rotating" }, [10])).toEqual({ 10: "rotating" });
  });
});
