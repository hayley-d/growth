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

export function useStepPlayer<Item>(steps: readonly Item[]) {
  const speed = usePlaybackStore((state) => state.speed);
  const [current, setCurrent] = useState({ steps, index: 0, isPlaying: false });

  const isFresh = current.steps === steps;
  const index = isFresh ? Math.min(current.index, Math.max(steps.length - 1, 0)) : 0;
  const isPlaying = isFresh && current.isPlaying;
  const lastIndex = steps.length - 1;
  const isFirst = index <= 0;
  const isLast = index >= lastIndex;

  const jumpTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(target, steps.length - 1));
      setCurrent({ steps, index: clamped, isPlaying: false });
    },
    [steps],
  );

  const first = useCallback(() => jumpTo(0), [jumpTo]);
  const last = useCallback(() => jumpTo(steps.length - 1), [jumpTo, steps.length]);
  const back = useCallback(() => jumpTo(index - 1), [jumpTo, index]);
  const forward = useCallback(() => jumpTo(index + 1), [jumpTo, index]);

  const toggle = useCallback(() => {
    if (steps.length < 2) return;
    if (isPlaying) {
      setCurrent({ steps, index, isPlaying: false });
      return;
    }
    setCurrent({ steps, index: isLast ? 0 : index, isPlaying: true });
  }, [steps, index, isPlaying, isLast]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrent((previous) => {
        if (!previous.isPlaying) return previous;
        const nextIndex = Math.min(previous.index + 1, previous.steps.length - 1);
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
      const actions: Record<string, () => void> = {
        " ": toggle,
        ArrowLeft: back,
        ArrowRight: forward,
        Home: first,
        End: last,
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
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
