import { describe, expect, it } from "vitest";

import { sameTarget } from "@/lib/playground/use-pointer-drag";

describe("sameTarget", () => {
  it("matches targets of the same kind and the same spot or key", () => {
    expect(
      sameTarget({ kind: "slot", slotId: "20-left" }, { kind: "slot", slotId: "20-left" }),
    ).toBe(true);
    expect(sameTarget({ kind: "node", key: 5 }, { kind: "node", key: 5 })).toBe(true);
    expect(sameTarget({ kind: "bin" }, { kind: "bin" })).toBe(true);
    expect(sameTarget(null, null)).toBe(true);
  });

  it("tells different targets apart", () => {
    expect(
      sameTarget({ kind: "slot", slotId: "20-left" }, { kind: "slot", slotId: "20-right" }),
    ).toBe(false);
    expect(sameTarget({ kind: "node", key: 5 }, { kind: "node", key: 6 })).toBe(false);
    expect(sameTarget({ kind: "bin" }, { kind: "predict" })).toBe(false);
    expect(sameTarget({ kind: "bin" }, null)).toBe(false);
  });
});
