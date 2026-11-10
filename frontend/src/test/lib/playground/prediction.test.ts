import { expect, it } from "vitest";

import { checkPrediction } from "@/lib/playground/prediction";

it("marks a right prediction", () => {
  expect(checkPrediction([1, 2, 3], [1, 2, 3])).toEqual({
    right: true,
    marks: [true, true, true],
    message: "Right, every place matches. Watch the walk to see why.",
  });
});

it("names the first wrong place", () => {
  const checked = checkPrediction([1, 3, 2], [1, 2, 3]);
  expect(checked.marks).toEqual([true, false, false]);
  expect(checked.message).toBe("Place 2 is 2, not 3. Watch the walk to see where it goes.");
});

it("says when the prediction is too short", () => {
  expect(checkPrediction([1], [1, 2]).message).toMatch(/visits 2 nodes and you placed 1/);
});
