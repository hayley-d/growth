import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { phaseLabel, type StepPhase, stepPhases } from "@/lib/step-phases";
import type { StepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";
import { type PlaybackSpeed, playbackSpeeds, usePlaybackStore } from "@/stores/playback-store";

type StepControlsProperties = {
  player: Omit<StepPlayer, "step">;
  phases: readonly StepPhase[];
  className?: string;
};

const phaseColour: Record<StepPhase, string> = {
  walk: "bg-phase-walk",
  height: "bg-phase-height",
  rebalance: "bg-phase-rebalance",
  rotate: "bg-phase-rotate",
};

const phaseShape: Record<StepPhase, string> = {
  walk: "rounded-full",
  height: "rounded-[2px]",
  rebalance: "rounded-[2px] rotate-45 scale-[0.85]",
  rotate: "[clip-path:polygon(50%_0,100%_100%,0_100%)]",
};

export function StepControls({ player, phases, className }: StepControlsProperties) {
  const { index, stepCount, isPlaying, isFirst, isLast } = player;
  const lineReference = useRef<HTMLDivElement>(null);
  const shownPhases = stepPhases.filter((option) => phases.includes(option.phase));
  const dots = phases.map((phase, position) => ({ stepNumber: position + 1, phase }));

  useEffect(() => {
    const line = lineReference.current;
    const current = line?.querySelector<HTMLElement>(`[data-step="${index}"]`);
    if (!line || !current || line.scrollWidth <= line.clientWidth) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    line.scrollTo({
      left: current.offsetLeft + current.offsetWidth / 2 - line.clientWidth / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [index]);

  if (stepCount === 0) return null;

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-3", className)}
    >
      <legend className="sr-only">Step player</legend>
      <p className="sr-only">
        Step {index + 1} of {stepCount}
      </p>
      <div
        ref={lineReference}
        className="relative -mx-2 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]"
      >
        <div className="flex min-w-full px-2 py-1">
          {dots.map(({ stepNumber, phase }) => {
            const stepIndex = stepNumber - 1;
            const isCurrent = stepIndex === index;
            const isDone = stepIndex < index;
            const isFirstDot = stepIndex === 0;
            const isLastDot = stepIndex === stepCount - 1;
            return (
              <button
                key={stepNumber}
                type="button"
                data-step={stepIndex}
                onClick={() => player.jumpTo(stepIndex)}
                aria-label={`Step ${stepNumber} of ${stepCount}, ${phaseLabel(phase)}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group relative grid h-11 w-11 flex-none cursor-pointer items-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:w-auto md:flex-[1_0_1rem]",
                  isFirstDot
                    ? "justify-items-start pl-2"
                    : isLastDot
                      ? "justify-items-end pr-2"
                      : "justify-items-center",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 h-0.75 -translate-y-1/2",
                    isFirstDot ? "left-3.5" : "left-0",
                    isLastDot ? "right-3.5" : "right-0",
                    phaseColour[phase],
                    isDone || isCurrent ? "opacity-100" : "opacity-35",
                  )}
                />
                <span aria-hidden="true" className="relative grid size-3 place-items-center">
                  {isCurrent ? (
                    <span className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card ring-2 ring-foreground" />
                  ) : null}
                  <span
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100 motion-reduce:transition-none",
                      isCurrent ? "size-4" : "size-3",
                      phaseColour[phase],
                      phaseShape[phase],
                      isDone || isCurrent ? "opacity-100" : "opacity-45",
                    )}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul
        aria-label="Key"
        className="flex flex-wrap gap-x-4 gap-y-1 pl-2 text-xs text-muted-foreground"
      >
        {shownPhases.map((option) => (
          <li key={option.phase} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn("size-3", phaseColour[option.phase], phaseShape[option.phase])}
            />
            {option.label}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-1 sm:col-start-2">
          <ControlButton
            label="First step"
            icon={ChevronFirst}
            onClick={player.first}
            disabled={isFirst}
          />
          <ControlButton
            label="Back one step"
            icon={ChevronLeft}
            onClick={player.back}
            disabled={isFirst}
          />
          <ControlButton
            label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? Pause : Play}
            onClick={player.toggle}
            disabled={stepCount < 2}
            isPrimary
          />
          <ControlButton
            label="Forward one step"
            icon={ChevronRight}
            onClick={player.forward}
            disabled={isLast}
          />
          <ControlButton
            label="Last step"
            icon={ChevronLast}
            onClick={player.last}
            disabled={isLast}
          />
        </div>
        <SpeedPicker />
      </div>
    </fieldset>
  );
}

type ControlButtonProperties = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
  isPrimary?: boolean;
};

function ControlButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  isPrimary = false,
}: ControlButtonProperties) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none",
        isPrimary
          ? "bg-foreground text-background hover:bg-foreground/85"
          : "text-foreground hover:bg-muted disabled:hover:bg-transparent",
      )}
    >
      <Icon aria-hidden="true" className={isPrimary ? "size-5 fill-current" : "size-5"} />
    </button>
  );
}

function SpeedPicker() {
  const speed = usePlaybackStore((state) => state.speed);
  const setSpeed = usePlaybackStore((state) => state.setSpeed);
  const name = useId();

  return (
    <fieldset className="inline-flex rounded-full bg-muted p-1 sm:justify-self-end">
      <legend className="sr-only">Playback speed</legend>
      {playbackSpeeds.map((option: PlaybackSpeed) => {
        const isSelected = option === speed;
        return (
          <label
            key={option}
            className={cn(
              "flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring motion-reduce:transition-none",
              isSelected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={isSelected}
              onChange={() => setSpeed(option)}
              className="sr-only"
            />
            {option}×
          </label>
        );
      })}
    </fieldset>
  );
}
