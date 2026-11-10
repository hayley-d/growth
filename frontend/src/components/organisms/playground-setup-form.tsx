import { Play } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type FormEvent, useState } from "react";

import { type SetupOption, SetupQuestion } from "@/components/molecules/setup-question";
import {
  exploreNames,
  type PlaygroundSearch,
  playgroundExploreModes,
  playgroundStarts,
  playgroundTopics,
  playgroundTraversals,
  startNames,
  topicNames,
  toSetup,
  traversalNames,
} from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type SetupField = "topic" | "traversal" | "explore" | "start";

type PlaygroundSetupFormProperties = {
  answers: PlaygroundSearch;
  onAnswer: (field: SetupField, value: string) => void;
  onStart: () => void;
  className?: string;
};

type Question = {
  field: SetupField;
  label: string;
  placeholder: string;
  options: readonly SetupOption[];
};

const toOptions = <Value extends string>(
  values: readonly Value[],
  names: Record<Value, string>,
): SetupOption[] => values.map((value) => ({ value, label: names[value] }));

const questionsFor = (answers: PlaygroundSearch): Question[] => {
  const questions: Question[] = [
    {
      field: "topic",
      label: "What topic?",
      placeholder: "Pick a topic",
      options: toOptions(playgroundTopics, topicNames),
    },
  ];
  if (!answers.topic) return questions;
  if (answers.topic === "traversal") {
    questions.push({
      field: "traversal",
      label: "What traversal?",
      placeholder: "Pick a traversal",
      options: toOptions(playgroundTraversals, traversalNames),
    });
    if (!answers.traversal) return questions;
  }
  questions.push({
    field: "explore",
    label: "How do you want to explore?",
    placeholder: "Pick a way to explore",
    options: toOptions(playgroundExploreModes, exploreNames),
  });
  if (!answers.explore) return questions;
  questions.push({
    field: "start",
    label: "What tree do you want to start with?",
    placeholder: "Pick a starting tree",
    options: toOptions(playgroundStarts, startNames),
  });
  return questions;
};

export function PlaygroundSetupForm({
  answers,
  onAnswer,
  onStart,
  className,
}: PlaygroundSetupFormProperties) {
  const [answeredOnce, setAnsweredOnce] = useState(false);
  const questions = questionsFor(answers);
  const complete = toSetup(answers) !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (complete) onStart();
  };

  return (
    <MotionConfig reducedMotion="user">
      <form
        aria-label="Set up the playground"
        onSubmit={handleSubmit}
        className={cn("rounded-3xl border-2 bg-card p-5 sm:p-7", className)}
      >
        <ol className="flex flex-col">
          <AnimatePresence initial={false}>
            {questions.map((question, index) => (
              <SetupQuestion
                key={question.field}
                id={`playground-${question.field}`}
                label={question.label}
                value={answers[question.field]}
                options={question.options}
                placeholder={question.placeholder}
                focusOnMount={answeredOnce}
                isLast={index === questions.length - 1 && !complete}
                onChange={(value) => {
                  setAnsweredOnce(true);
                  onAnswer(question.field, value);
                }}
              />
            ))}
          </AnimatePresence>
        </ol>
        <AnimatePresence initial={false}>
          {complete ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4"
            >
              <span aria-hidden="true" className="flex justify-center">
                <span className="mt-3 size-3 rounded-full bg-primary" />
              </span>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 justify-self-start rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-0 motion-reduce:transition-none"
              >
                <Play aria-hidden="true" className="size-4" fill="currentColor" />
                Start
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </form>
    </MotionConfig>
  );
}
