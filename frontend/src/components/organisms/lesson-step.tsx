import { ChevronDown, Target } from "lucide-react";
import { useId, useState } from "react";

import type { LessonStepBlock, LessonStep as LessonStepData } from "@shared/schemas";
import { ListenButton } from "@/components/molecules/listen-button";
import { LessonBlock, leadsWithText } from "@/components/organisms/lesson-block";
import { learningStyleIcon, learningStyleLabel } from "@/lib/lesson/learning-style-icons";
import { pickExtra } from "@/lib/lesson/pick-extra";
import { TreeLinksProvider } from "@/lib/lesson/tree-links";
import { cn } from "@/lib/utils";

type LessonStepProperties = {
  step: LessonStepData;
  stepNumber: number;
  objectives: readonly string[] | null;
  styleNames: Readonly<Record<string, string>>;
  showListen: boolean;
};

function StyledBlock({
  block,
  styleNames,
  heading,
}: {
  block: LessonStepBlock;
  styleNames: Readonly<Record<string, string>>;
  heading: "h3" | "h4";
}) {
  const name = block.learningStyleId ? styleNames[block.learningStyleId] : undefined;
  const Icon = learningStyleIcon(name);
  const Heading = heading;
  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5">
      <Heading className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Icon aria-hidden className="size-4" />
        {learningStyleLabel(name)}
      </Heading>
      <LessonBlock block={block} />
    </article>
  );
}

export function LessonStep({
  step,
  stepNumber,
  objectives,
  styleNames,
  showListen,
}: LessonStepProperties) {
  const othersId = useId();
  const [othersOpen, setOthersOpen] = useState(false);
  const extra = pickExtra(step, styleNames);
  const transcripts = [step.coreBlock.transcript, extra.block?.transcript ?? ""];
  const otherCount = extra.others.length;
  const extraLabel = extra.matchesStyle ? "Picked for you" : "Another way to see it";
  const hasObjectives = objectives !== null && objectives.length > 0;
  const listenPlace = hasObjectives
    ? "objectives"
    : leadsWithText(step.coreBlock)
      ? "core"
      : "own-row";
  const listen = showListen ? (
    <ListenButton id={`step-${step.position}`} texts={transcripts} />
  ) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="sr-only">Step {stepNumber}</h2>
      {listenPlace === "own-row" && listen ? (
        <div className="flex justify-end">{listen}</div>
      ) : null}

      {objectives && objectives.length > 0 ? (
        <section
          aria-labelledby={`${othersId}-objectives`}
          className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 id={`${othersId}-objectives`} className="flex items-center gap-2 font-semibold">
              <Target aria-hidden className="size-4 text-primary" />
              What you'll learn
            </h3>
            {listenPlace === "objectives" ? listen : null}
          </div>
          <ul className="flex flex-col gap-1 pl-6 list-disc">
            {objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <TreeLinksProvider>
        <LessonBlock block={step.coreBlock} aside={listenPlace === "core" ? listen : undefined} />

        {extra.block ? (
          <section aria-label={extraLabel} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">{extraLabel}</p>
            <StyledBlock block={extra.block} styleNames={styleNames} heading="h3" />
          </section>
        ) : null}
      </TreeLinksProvider>

      {otherCount > 0 ? (
        <section className="flex flex-col gap-3">
          <h3>
            <button
              type="button"
              aria-expanded={othersOpen}
              aria-controls={othersId}
              onClick={() => setOthersOpen((current) => !current)}
              className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-1 text-left font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Other ways to learn this ({otherCount})
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-5 transition-transform motion-reduce:transition-none",
                  othersOpen && "rotate-180",
                )}
              />
            </button>
          </h3>
          <div id={othersId} hidden={!othersOpen} className="flex flex-col gap-4">
            {othersOpen
              ? extra.others.map((block) => (
                  <StyledBlock key={block.id} block={block} styleNames={styleNames} heading="h4" />
                ))
              : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
