import type { KeyboardEvent } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { traceInsert } from "@shared/avl";
import { baseStepDuration, useStepPlayer } from "@/lib/use-step-player";
import { usePlaybackStore } from "@/stores/playback-store";

const makeSteps = (count: number) =>
  Array.from({ length: count }, (_, position) => Object.freeze({ number: position + 1 }));

const keyEvent = (
  key: string,
  target: EventTarget = document.createElement("button"),
  repeat = false,
) => {
  const preventDefault = vi.fn();
  const event = {
    key,
    target,
    repeat,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    preventDefault,
  } as unknown as KeyboardEvent<HTMLElement>;
  return { event, preventDefault };
};

beforeEach(() => {
  usePlaybackStore.setState({ speed: 1 });
});

afterEach(() => {
  vi.useRealTimers();
});

it("steps forward and back and stops at both ends", async () => {
  const steps = makeSteps(3);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  expect(result.current.index).toBe(0);
  expect(result.current.isFirst).toBe(true);

  await act(() => result.current.back());
  expect(result.current.index).toBe(0);

  await act(() => result.current.forward());
  await act(() => result.current.forward());
  await act(() => result.current.forward());
  expect(result.current.index).toBe(2);
  expect(result.current.isLast).toBe(true);

  await act(() => result.current.first());
  expect(result.current.index).toBe(0);

  await act(() => result.current.last());
  expect(result.current.index).toBe(2);

  await act(() => result.current.jumpTo(1));
  expect(result.current.index).toBe(1);
  expect(result.current.stepCount).toBe(3);
});

it("shows the same unchanged traced step after going forward and back", async () => {
  const { steps } = traceInsert(traceInsert(traceInsert(null, 20).result, 10).result, 5);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => result.current.forward());
  const seen = structuredClone(result.current.step);
  await act(() => result.current.forward());
  await act(() => result.current.back());

  expect(result.current.step).toBe(steps[1]);
  expect(result.current.step).toEqual(seen);
});

it("counts two steps pressed before a render", async () => {
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => {
    result.current.forward();
    result.current.forward();
  });

  expect(result.current.index).toBe(2);
});

type RunProperties = { steps: readonly { number: number }[]; runKey: string };

const renderRun = (initialProps: RunProperties) =>
  renderHook(
    (current?: RunProperties) => useStepPlayer(current?.steps ?? [], current?.runKey ?? ""),
    { initialProps },
  );

it("keeps its place when rendered again with the same run", async () => {
  const steps = makeSteps(4);
  const { result, act, rerender } = await renderRun({ steps, runKey: "run" });

  await act(() => result.current.jumpTo(2));
  await rerender({ steps, runKey: "run" });

  expect(result.current.index).toBe(2);
});

it("keeps its place when the same run arrives as a new array every render", async () => {
  const { result, act, rerender } = await renderHook(() => useStepPlayer(makeSteps(4), "run"));

  await act(() => result.current.jumpTo(2));
  await act(() => result.current.toggle());
  await rerender();

  expect(result.current.index).toBe(2);
  expect(result.current.isPlaying).toBe(true);
});

it("stays on a real step when the same run comes back shorter", async () => {
  const { result, act, rerender } = await renderRun({ steps: makeSteps(5), runKey: "run" });

  await act(() => result.current.jumpTo(4));
  await rerender({ steps: makeSteps(2), runKey: "run" });

  expect(result.current.index).toBe(1);
  expect(result.current.isLast).toBe(true);
});

it("starts from the first step when an earlier run comes back", async () => {
  const firstRun = makeSteps(5);
  const { result, act, rerender } = await renderRun({ steps: firstRun, runKey: "first" });

  await act(() => result.current.jumpTo(3));
  await rerender({ steps: makeSteps(2), runKey: "second" });
  await rerender({ steps: firstRun, runKey: "first" });

  expect(result.current.index).toBe(0);
  expect(result.current.isPlaying).toBe(false);
});

it("plays on its own and stops on the last step", async () => {
  vi.useFakeTimers();
  const steps = makeSteps(3);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => result.current.toggle());
  expect(result.current.isPlaying).toBe(true);

  await act(() => vi.advanceTimersByTime(baseStepDuration));
  expect(result.current.index).toBe(1);

  await act(() => vi.advanceTimersByTime(baseStepDuration));
  expect(result.current.index).toBe(2);
  expect(result.current.isPlaying).toBe(false);

  await act(() => vi.advanceTimersByTime(baseStepDuration * 3));
  expect(result.current.index).toBe(2);
});

it("plays faster at a higher speed", async () => {
  vi.useFakeTimers();
  usePlaybackStore.setState({ speed: 2 });
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => result.current.toggle());
  await act(() => vi.advanceTimersByTime(baseStepDuration));

  expect(result.current.index).toBe(2);
});

it("starts again from the first step when played on the last", async () => {
  const steps = makeSteps(3);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => result.current.last());
  await act(() => result.current.toggle());

  expect(result.current.index).toBe(0);
  expect(result.current.isPlaying).toBe(true);
});

it("pauses when the learner steps by hand", async () => {
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  await act(() => result.current.toggle());
  await act(() => result.current.forward());

  expect(result.current.isPlaying).toBe(false);
});

it("goes back to the first step for a new run", async () => {
  const { result, act, rerender } = await renderRun({ steps: makeSteps(5), runKey: "first" });

  await act(() => result.current.last());
  await act(() => result.current.toggle());
  await rerender({ steps: makeSteps(5), runKey: "second" });

  expect(result.current.index).toBe(0);
  expect(result.current.isPlaying).toBe(false);
});

it("keeps two players apart", async () => {
  const steps = makeSteps(3);
  const { result, act } = await renderHook(() => ({
    one: useStepPlayer(steps, "run"),
    two: useStepPlayer(steps, "run"),
  }));

  await act(() => result.current.one.forward());

  expect(result.current.one.index).toBe(1);
  expect(result.current.two.index).toBe(0);
});

it("plays with Space and steps with the arrow, Home and End keys", async () => {
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  const right = keyEvent("ArrowRight");
  await act(() => result.current.handleKeyDown(right.event));
  expect(result.current.index).toBe(1);
  expect(right.preventDefault).toHaveBeenCalled();

  await act(() => result.current.handleKeyDown(keyEvent("End").event));
  expect(result.current.index).toBe(3);

  await act(() => result.current.handleKeyDown(keyEvent("ArrowLeft").event));
  expect(result.current.index).toBe(2);

  await act(() => result.current.handleKeyDown(keyEvent("Home").event));
  expect(result.current.index).toBe(0);

  await act(() => result.current.handleKeyDown(keyEvent(" ").event));
  expect(result.current.isPlaying).toBe(true);
});

it("leaves keys alone in inputs and radio groups", async () => {
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));
  const radio = document.createElement("input");
  radio.type = "radio";
  const tab = document.createElement("button");
  tab.setAttribute("role", "tab");

  const fromRadio = keyEvent("ArrowRight", radio);
  await act(() => result.current.handleKeyDown(fromRadio.event));
  await act(() => result.current.handleKeyDown(keyEvent("ArrowRight", tab).event));

  expect(result.current.index).toBe(0);
  expect(fromRadio.preventDefault).not.toHaveBeenCalled();
});

it("ignores a held Space key", async () => {
  const steps = makeSteps(4);
  const { result, act } = await renderHook(() => useStepPlayer(steps, "run"));

  const held = keyEvent(" ", document.createElement("button"), true);
  await act(() => result.current.handleKeyDown(held.event));

  expect(result.current.isPlaying).toBe(false);
  expect(held.preventDefault).toHaveBeenCalled();
});
