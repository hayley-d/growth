import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

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

type PlayerState = {
  runKey: string;
  index: number;
  isPlaying: boolean;
};

export function useStepPlayer<Item>(steps: readonly Item[], runKey: string) {
  const speed = usePlaybackStore((state) => state.speed);
  const stepCount = useRef(steps.length);
  stepCount.current = steps.length;
  const [current, setCurrent] = useState<PlayerState>({
    runKey,
    index: 0,
    isPlaying: false,
  });

  const isFresh = current.runKey === runKey;
  if (!isFresh) {
    setCurrent({ runKey, index: 0, isPlaying: false });
  }

  const index = isFresh ? clampIndex(current.index, steps.length) : 0;
  const isPlaying = isFresh && current.isPlaying;
  const isFirst = index <= 0;
  const isLast = index >= steps.length - 1;

  const moveTo = useCallback((target: (previous: PlayerState) => number) => {
    setCurrent((previous) => ({
      runKey: previous.runKey,
      index: clampIndex(target(previous), stepCount.current),
      isPlaying: false,
    }));
  }, []);

  const jumpTo = useCallback((target: number) => moveTo(() => target), [moveTo]);
  const first = useCallback(() => moveTo(() => 0), [moveTo]);
  const last = useCallback(() => moveTo(() => stepCount.current - 1), [moveTo]);
  const back = useCallback(() => moveTo((previous) => previous.index - 1), [moveTo]);
  const forward = useCallback(() => moveTo((previous) => previous.index + 1), [moveTo]);

  const toggle = useCallback(() => {
    setCurrent((previous) => {
      const lastIndex = stepCount.current - 1;
      if (lastIndex < 1) return previous;
      if (previous.isPlaying) return { ...previous, isPlaying: false };
      return {
        runKey: previous.runKey,
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
        const nextIndex = clampIndex(previous.index + 1, stepCount.current);
        return {
          runKey: previous.runKey,
          index: nextIndex,
          isPlaying: nextIndex < stepCount.current - 1,
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
