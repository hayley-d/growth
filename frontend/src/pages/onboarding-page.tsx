import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import type {
  ListCodeLanguagesResponse,
  ListLearningStylesResponse,
  QuizQuestion,
} from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { ChoiceButton } from "@/components/molecules/choice-button";
import { PageLoader } from "@/components/molecules/page-loader";
import { LearningStyleQuiz } from "@/components/organisms/learning-style-quiz";
import { LearningStyleResult } from "@/components/organisms/learning-style-result";
import {
  useCompleteOnboardingMutation,
  useScoreQuizMutation,
  useUpdateProfileMutation,
} from "@/lib/mutations";
import { useCodeLanguagesQuery, useLearningStylesQuery, useQuizQuery } from "@/lib/queries";
import { onboardingSteps, useOnboardingStore } from "@/stores/onboarding-store";

type LearningStyles = ListLearningStylesResponse["data"]["learningStyles"];
type CodeLanguages = ListCodeLanguagesResponse["data"]["codeLanguages"];

const stepTitles = [
  "Find your learning style",
  "Which language do you want to see code in?",
  "Do you want to appear on the leaderboard?",
  "Would you like lessons read aloud?",
];

function ErrorMessage({ children, onRetry }: { children: ReactNode; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p className="text-sm text-destructive">{children}</p>
      <Button variant="outline" className="min-h-11" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function StepActions({
  canContinue,
  nextLabel = "Next",
  pending = false,
  onBack,
  onNext,
}: {
  canContinue: boolean;
  nextLabel?: string;
  pending?: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" className="min-h-11 px-4" onClick={onBack}>
        <ArrowLeft aria-hidden="true" />
        Back
      </Button>
      <Button className="min-h-11 px-6" disabled={!canContinue || pending} onClick={onNext}>
        {pending ? "Saving…" : nextLabel}
      </Button>
    </div>
  );
}

function YesNoChoice({
  value,
  yesLabel,
  noLabel,
  onChange,
}: {
  value: boolean | null;
  yesLabel: string;
  noLabel: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      <li>
        <ChoiceButton selected={value === true} onClick={() => onChange(true)}>
          {yesLabel}
        </ChoiceButton>
      </li>
      <li>
        <ChoiceButton selected={value === false} onClick={() => onChange(false)}>
          {noLabel}
        </ChoiceButton>
      </li>
    </ul>
  );
}

function LearningStyleStep({
  retake,
  questions,
  learningStyles,
}: {
  retake: boolean;
  questions: QuizQuestion[];
  learningStyles: LearningStyles;
}) {
  const quizAnswers = useOnboardingStore((state) => state.quizAnswers);
  const scoredLearningStyleId = useOnboardingStore((state) => state.scoredLearningStyleId);
  const learningStyleId = useOnboardingStore((state) => state.learningStyleId);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);
  const score = useScoreQuizMutation();
  const save = useUpdateProfileMutation();
  const navigate = useNavigate();

  const submit = (answers: Record<string, string>) =>
    score.mutate(
      Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      {
        onSuccess: (response) => {
          const { id } = response.data.learningStyle;
          setAnswers({ scoredLearningStyleId: id, learningStyleId: id });
        },
      },
    );

  if (scoredLearningStyleId && learningStyleId) {
    return (
      <LearningStyleResult
        scoredId={scoredLearningStyleId}
        selectedId={learningStyleId}
        learningStyles={learningStyles}
        onSelect={(id) => setAnswers({ learningStyleId: id })}
        onBack={() => setAnswers({ scoredLearningStyleId: null })}
        action={
          retake ? (
            <>
              {save.isError ? (
                <p role="alert" className="text-sm text-destructive">
                  {save.error.message}
                </p>
              ) : null}
              <Button
                className="min-h-11 px-6"
                disabled={save.isPending}
                onClick={() =>
                  save.mutate(
                    { learningStyleId },
                    { onSuccess: () => navigate({ to: "/settings" }) },
                  )
                }
              >
                {save.isPending ? "Saving…" : "Save"}
              </Button>
            </>
          ) : (
            <Button className="min-h-11 px-6" onClick={() => setAnswers({ step: 1 })}>
              Next
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <LearningStyleQuiz
        questions={questions}
        answers={quizAnswers}
        onAnswersChange={(answers) => setAnswers({ quizAnswers: answers })}
        onComplete={submit}
      />
      {score.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Working out your learning style…
        </p>
      ) : null}
      {score.isError ? (
        <ErrorMessage onRetry={() => submit(quizAnswers)}>{score.error.message}</ErrorMessage>
      ) : null}
    </div>
  );
}

function CodeLanguageStep({ codeLanguages }: { codeLanguages: CodeLanguages }) {
  const codeLanguageId = useOnboardingStore((state) => state.codeLanguageId);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);

  return (
    <>
      <p className="text-muted-foreground">
        Code traces show the code in this language. You can change it any time in Settings.
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {codeLanguages.map((language) => (
          <li key={language.id}>
            <ChoiceButton
              selected={codeLanguageId === language.id}
              onClick={() => setAnswers({ codeLanguageId: language.id })}
            >
              {language.name}
            </ChoiceButton>
          </li>
        ))}
      </ul>
      <StepActions
        canContinue={codeLanguageId !== null}
        onBack={() => setAnswers({ step: 0 })}
        onNext={() => setAnswers({ step: 2 })}
      />
    </>
  );
}

function LeaderboardStep() {
  const showOnLeaderboard = useOnboardingStore((state) => state.showOnLeaderboard);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);

  return (
    <>
      <p className="text-muted-foreground">
        Other learners see your display name and points. You can change this any time in Settings.
      </p>
      <YesNoChoice
        value={showOnLeaderboard}
        yesLabel="Yes, show me"
        noLabel="No, keep me off it"
        onChange={(value) => setAnswers({ showOnLeaderboard: value })}
      />
      <StepActions
        canContinue={showOnLeaderboard !== null}
        onBack={() => setAnswers({ step: 1 })}
        onNext={() => setAnswers({ step: 3 })}
      />
    </>
  );
}

function TextToSpeechStep() {
  const answers = useOnboardingStore();
  const complete = useCompleteOnboardingMutation();
  const navigate = useNavigate();
  const { learningStyleId, codeLanguageId, showOnLeaderboard, textToSpeech, setAnswers } = answers;

  const finish = () => {
    if (
      !learningStyleId ||
      !codeLanguageId ||
      showOnLeaderboard === null ||
      textToSpeech === null
    ) {
      return;
    }
    complete.mutate(
      { learningStyleId, codeLanguageId, showOnLeaderboard, textToSpeech },
      { onSuccess: () => navigate({ to: "/" }) },
    );
  };

  return (
    <>
      <p className="text-muted-foreground">
        Each lesson step gets a Listen button that reads it out with your browser's voice. You can
        change this any time in Settings.
      </p>
      <YesNoChoice
        value={textToSpeech}
        yesLabel="Yes, read them aloud"
        noLabel="No thanks"
        onChange={(value) => setAnswers({ textToSpeech: value })}
      />
      {complete.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {complete.error.message}. Your answers are still here, so you can try again.
        </p>
      ) : null}
      <StepActions
        canContinue={textToSpeech !== null}
        nextLabel="Finish"
        pending={complete.isPending}
        onBack={() => setAnswers({ step: 2 })}
        onNext={finish}
      />
    </>
  );
}

export function OnboardingPage({ retake = false }: { retake?: boolean }) {
  const quiz = useQuizQuery();
  const learningStyles = useLearningStylesQuery();
  const codeLanguages = useCodeLanguagesQuery();
  const step = useOnboardingStore((state) => state.step);
  const headingReference = useRef<HTMLHeadingElement>(null);
  const shownStep = useRef(step);
  const queries = retake ? [quiz, learningStyles] : [quiz, learningStyles, codeLanguages];

  useEffect(() => () => useOnboardingStore.getState().reset(), []);

  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingReference.current?.focus();
  }, [step]);

  const content = () => {
    if (queries.some((query) => query.isError)) {
      return (
        <ErrorMessage
          onRetry={() => {
            for (const query of queries) if (query.isError) query.refetch();
          }}
        >
          We couldn't load the questions.
        </ErrorMessage>
      );
    }
    if (!quiz.data || !learningStyles.data || (!retake && !codeLanguages.data)) {
      return <PageLoader />;
    }
    if (step === 1 && codeLanguages.data) {
      return <CodeLanguageStep codeLanguages={codeLanguages.data.data.codeLanguages} />;
    }
    if (step === 2) return <LeaderboardStep />;
    if (step === 3) return <TextToSpeechStep />;
    return (
      <LearningStyleStep
        retake={retake}
        questions={quiz.data.data.questions}
        learningStyles={learningStyles.data.data.learningStyles}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {retake ? "Retake the quiz" : `Step ${step + 1} of ${onboardingSteps}`}
          </p>
          {retake ? (
            <Link
              to="/settings"
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
            >
              Cancel
            </Link>
          ) : null}
        </div>
        <h1
          ref={headingReference}
          tabIndex={-1}
          className="text-2xl font-semibold outline-none sm:text-3xl"
        >
          {stepTitles[step]}
        </h1>
        {step === 0 && !retake ? (
          <p className="mt-2 text-muted-foreground">
            Let's set up your account. It's 4 quick steps, and you can change any of it later in
            Settings.
          </p>
        ) : null}
      </div>
      {content()}
    </div>
  );
}
