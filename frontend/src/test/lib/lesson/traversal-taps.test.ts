import { expect, it } from "vitest";

import { emptyTaps, isFinished, tapMessage, tapNode } from "@/lib/lesson/traversal-taps";

const expected = [8, 4, 12];

it("places a right tap on the next beat", () => {
  const taps = tapNode(emptyTaps, 8, expected);

  expect(taps).toEqual({ placed: [8], wrong: [] });
  expect(tapMessage(taps, expected, "pre-order")).toBe("8 is right. Tap the node for beat 2.");
});

it("writes a wrong tap above the beat it was meant for", () => {
  const taps = tapNode(tapNode(emptyTaps, 8, expected), 12, expected);

  expect(taps).toEqual({ placed: [8], wrong: [{ key: 12, beat: 1 }] });
  expect(tapMessage(taps, expected, "pre-order")).toBe(
    "Not 12. Beat 2 is still open, try another node.",
  );
});

it("ignores taps on placed nodes and after the last beat", () => {
  const done = [8, 4, 12].reduce((taps, key) => tapNode(taps, key, expected), emptyTaps);

  expect(isFinished(done, expected)).toBe(true);
  expect(tapNode(done, 4, expected)).toBe(done);
  expect(tapMessage(done, expected, "pre-order")).toBe(
    "That's the whole pre-order order: 8, 4, 12.",
  );
});

it("asks for the first node to start with", () => {
  expect(tapMessage(emptyTaps, expected, "in-order")).toBe("Tap the first node in in-order.");
  expect(isFinished(emptyTaps, [])).toBe(false);
});
