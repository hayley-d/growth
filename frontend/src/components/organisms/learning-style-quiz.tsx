import { useEffect, useRef, useState } from "react";

import type { QuizQuestion } from "@shared/schemas";
import { ChoiceButton } from "@/components/molecules/choice-button";
import { ProgressHeader } from "@/components/molecules/progress-header";

export type QuizAnswers = Record<string, string>;

type LearningStyleQuizProperties = {
  questions: QuizQuestion[];
  answers: QuizAnswers;
  onAnswersChange: (answers: QuizAnswers) => void;
  onComplete: (answers: QuizAnswers) => void;
};

export function LearningStyleQuiz({
  questions,
  answers,
  onAnswersChange,
  onComplete,
}: LearningStyleQuizProperties) {
  const [index, setIndex] = useState(() =>
    Math.min(questions.filter((question) => answers[question.id]).length, questions.length - 1),
  );
  const headingReference = useRef<HTMLHeadingElement>(null);
  const shownIndex = useRef(index);

  useEffect(() => {
    if (shownIndex.current === index) return;
    shownIndex.current = index;
    headingReference.current?.focus();
  }, [index]);

  const question = questions[index];
  if (!question) return null;

  const choose = (optionId: string) => {
    const next = { ...answers, [question.id]: optionId };
    onAnswersChange(next);
    if (index === questions.length - 1) onComplete(next);
    else setIndex(index + 1);
  };

  return (
    <section aria-labelledby="quiz-question" className="flex flex-col gap-6">
      <ProgressHeader
        label={`Question ${index + 1} of ${questions.length}`}
        done={index}
        total={questions.length}
        onBack={index > 0 ? () => setIndex(index - 1) : undefined}
      />
      <div>
        <h2
          id="quiz-question"
          ref={headingReference}
          tabIndex={-1}
          className="text-2xl leading-tight font-semibold outline-none sm:text-3xl"
        >
          {question.prompt}
        </h2>
        <p className="mt-2 text-muted-foreground">Pick the one that sounds most like you.</p>
      </div>
      <ul className="flex flex-col gap-3">
        {question.options.map((option) => (
          <li key={option.id}>
            <ChoiceButton
              selected={answers[question.id] === option.id}
              onClick={() => choose(option.id)}
            >
              {option.text}
            </ChoiceButton>
          </li>
        ))}
      </ul>
    </section>
  );
}
