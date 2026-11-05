import { type KeyboardEvent, useCallback, useEffect, useState } from "react";

import { usePlaybackStore } from "@/stores/playback-store";

export const baseStepDuration = 1000;

const ignoredRoles = new Set(["radio", "tab", "slider", "textbox", "combobox", "spinbutton"]);

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
  const role = target.getAttribute("role");
  return role !== null && ignoredRoles.has(role);
};

const clampIndex = (target: number, count: number) =>
  Math.min(Math.max(target, 0), Math.max(count - 1, 0));

type PlayerState<Item> = {
  steps: readonly Item[];
  index: number;
  isPlaying: boolean;
};

export function useStepPlayer<Item>(steps: readonly Item[]) {
  const speed = usePlaybackStore((state) => state.speed);
  const [current, setCurrent] = useState<PlayerState<Item>>({
    steps,
    index: 0,
    isPlaying: false,
  });

  const isFresh = current.steps === steps;
  if (!isFresh) {
    setCurrent({ steps, index: 0, isPlaying: false });
  }

  const index = isFresh ? clampIndex(current.index, steps.length) : 0;
  const isPlaying = isFresh && current.isPlaying;
  const isFirst = index <= 0;
  const isLast = index >= steps.length - 1;

  const moveTo = useCallback((target: (previous: PlayerState<Item>) => number) => {
    setCurrent((previous) => ({
      steps: previous.steps,
      index: clampIndex(target(previous), previous.steps.length),
      isPlaying: false,
    }));
  }, []);

  const jumpTo = useCallback((target: number) => moveTo(() => target), [moveTo]);
  const first = useCallback(() => moveTo(() => 0), [moveTo]);
  const last = useCallback(() => moveTo((previous) => previous.steps.length - 1), [moveTo]);
  const back = useCallback(() => moveTo((previous) => previous.index - 1), [moveTo]);
  const forward = useCallback(() => moveTo((previous) => previous.index + 1), [moveTo]);

  const toggle = useCallback(() => {
    setCurrent((previous) => {
      const lastIndex = previous.steps.length - 1;
      if (lastIndex < 1) return previous;
      if (previous.isPlaying) return { ...previous, isPlaying: false };
      return {
        steps: previous.steps,
        index: previous.index >= lastIndex ? 0 : previous.index,
        isPlaying: true,
      };
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrent((previous) => {
        if (!previous.isPlaying) return previous;
        const nextIndex = clampIndex(previous.index + 1, previous.steps.length);
        return {
          steps: previous.steps,
          index: nextIndex,
          isPlaying: nextIndex < previous.steps.length - 1,
        };
      });
    }, baseStepDuration / speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;
      switch (event.key) {
        case " ":
          event.preventDefault();
          if (!event.repeat) toggle();
          return;
        case "ArrowLeft":
          event.preventDefault();
          back();
          return;
        case "ArrowRight":
          event.preventDefault();
          forward();
          return;
        case "Home":
          event.preventDefault();
          first();
          return;
        case "End":
          event.preventDefault();
          last();
          return;
      }
    },
    [toggle, back, forward, first, last],
  );

  return {
    index,
    step: steps[index] ?? null,
    stepCount: steps.length,
    isPlaying,
    isFirst,
    isLast,
    first,
    back,
    forward,
    last,
    toggle,
    jumpTo,
    handleKeyDown,
  };
}

export type StepPlayer = ReturnType<typeof useStepPlayer>;
