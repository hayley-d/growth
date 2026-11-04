import { describe, expect, it } from "vitest";

import { getHeatmapLevel } from "@/domain/activity/heatmap-level";

describe("getHeatmapLevel", () => {
  it.each([
    [0, 0],
    [1, 1],
    [4, 1],
    [5, 2],
    [9, 2],
    [10, 3],
    [19, 3],
    [20, 4],
    [150, 4],
  ])("puts %i answers at level %i", (count, level) => {
    expect(getHeatmapLevel(count)).toBe(level);
  });
});
