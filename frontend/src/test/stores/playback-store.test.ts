import { beforeEach, expect, it } from "vitest";

import { mergeStoredPlaybackSpeed, usePlaybackStore } from "@/stores/playback-store";

beforeEach(() => {
  usePlaybackStore.setState({ speed: 1 });
});

it("starts at normal speed", () => {
  expect(usePlaybackStore.getState().speed).toBe(1);
});

it("changes the speed", () => {
  usePlaybackStore.getState().setSpeed(2);

  expect(usePlaybackStore.getState().speed).toBe(2);
});

it("only restores a known saved speed", () => {
  const current = usePlaybackStore.getState();

  expect(mergeStoredPlaybackSpeed({ speed: 7 }, current).speed).toBe(1);
  expect(mergeStoredPlaybackSpeed({ speed: "2" }, current).speed).toBe(1);
  expect(mergeStoredPlaybackSpeed(undefined, current).speed).toBe(1);
  expect(mergeStoredPlaybackSpeed({ speed: 0.5 }, current).speed).toBe(0.5);
});
