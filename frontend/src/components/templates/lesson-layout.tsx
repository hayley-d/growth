import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/button";
import { LessonProgress } from "@/components/molecules/lesson-progress";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type LessonLayoutProperties = {
  unitTitle: string;
  lessonTitle: string;
  stepNumber: number;
  totalSteps: number;
  finished: boolean;
  isFirst: boolean;
  isLast: boolean;
  lastLabel?: string;
  onBack: () => void;
  onContinue: () => void;
  children: ReactNode;
};

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
  return target.closest('[role="slider"], [role="tablist"], [role="radiogroup"]') !== null;
};

export function LessonLayout({
  unitTitle,
  lessonTitle,
  stepNumber,
  totalSteps,
  finished,
  isFirst,
  isLast,
  lastLabel = "Finish the lesson",
  onBack,
  onContinue,
  children,
}: LessonLayoutProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [previousStep, setPreviousStep] = useState(stepNumber);
  const [stepDirection, setStepDirection] = useState(1);
  if (stepNumber !== previousStep) {
    setPreviousStep(stepNumber);
    setStepDirection(stepNumber > previousStep ? 1 : -1);
  }
  const direction = finished ? 1 : stepDirection;
  const handlers = useRef({ onBack, onContinue, isFirst, finished });
  handlers.current = { onBack, onContinue, isFirst, finished };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;
      const current = handlers.current;
      if (current.finished) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        current.onContinue();
      } else if (event.key === "ArrowLeft" && !current.isFirst) {
        event.preventDefault();
        current.onBack();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn("flex w-full flex-col gap-6", !finished && "pb-24 [--dock-bottom:4.3125rem]")}
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Link
            to="/learn"
            aria-label="Close the lesson"
            className="grid size-11 shrink-0 place-items-center rounded-md border border-transparent hover:border-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X aria-hidden className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{unitTitle}</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lessonTitle}</h1>
          </div>
        </div>
        <LessonProgress stepNumber={stepNumber} totalSteps={totalSteps} finished={finished} />
      </header>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={finished ? "finished" : stepNumber}
          initial={reduced ? false : { opacity: 0, x: 32 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -32 * direction }}
          transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
          className="w-full min-w-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {finished ? null : (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              disabled={isFirst}
              onClick={onBack}
            >
              <ArrowLeft aria-hidden />
              Back
            </Button>
            <Button type="button" className="min-h-11 px-6" onClick={onContinue}>
              {isLast ? lastLabel : "Continue"}
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
