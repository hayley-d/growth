import type { ReactNode } from "react";

import type { ListLearningStylesResponse } from "@shared/schemas";
import { ChoiceButton } from "@/components/molecules/choice-button";
import { ProgressHeader } from "@/components/molecules/progress-header";

type LearningStyle = ListLearningStylesResponse["data"]["learningStyles"][number];

type LearningStyleResultProperties = {
  scoredId: string;
  selectedId: string;
  learningStyles: LearningStyle[];
  onSelect: (learningStyleId: string) => void;
  onBack: () => void;
  action: ReactNode;
};

export function LearningStyleResult({
  scoredId,
  selectedId,
  learningStyles,
  onSelect,
  onBack,
  action,
}: LearningStyleResultProperties) {
  const selected = learningStyles.find((style) => style.id === selectedId);
  const scored = learningStyles.find((style) => style.id === scoredId);
  if (!selected) return null;

  return (
    <section aria-labelledby="learning-style-result" className="flex flex-col gap-6">
      <ProgressHeader label="Your result" done={1} total={1} onBack={onBack} />
      <div>
        <p className="text-sm font-medium text-muted-foreground">Your learning style</p>
        <h2 id="learning-style-result" className="text-2xl leading-tight font-semibold sm:text-3xl">
          {selected.name}
        </h2>
        <p className="mt-2">{selected.description}</p>
        {scored && scored.id !== selected.id ? (
          <p className="mt-2 text-sm text-muted-foreground">The quiz suggested {scored.name}.</p>
        ) : null}
      </div>
      <div className="rounded-xl border-2 border-border bg-card p-4">
        <h3 className="font-semibold">What changes in Growth</h3>
        <p className="mt-1 text-muted-foreground">
          Each lesson step adds a part made for {selected.name.toLowerCase()} learners. You can
          change your learning style any time in Settings.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold">Not quite you? Pick another</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {learningStyles.map((style) => (
            <li key={style.id}>
              <ChoiceButton selected={style.id === selectedId} onClick={() => onSelect(style.id)}>
                {style.name}
              </ChoiceButton>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-end gap-3">{action}</div>
    </section>
  );
}
