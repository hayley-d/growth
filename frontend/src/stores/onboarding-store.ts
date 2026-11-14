import { create } from "zustand";

export const onboardingSteps = 5;

type OnboardingAnswers = {
  step: number;
  quizAnswers: Record<string, string>;
  scoredLearningStyleId: string | null;
  learningStyleId: string | null;
  codeLanguageId: string | null;
  showOnLeaderboard: boolean | null;
  textToSpeech: boolean | null;
};

type OnboardingState = OnboardingAnswers & {
  setAnswers: (answers: Partial<OnboardingAnswers>) => void;
  reset: () => void;
};

const initialAnswers: OnboardingAnswers = {
  step: 0,
  quizAnswers: {},
  scoredLearningStyleId: null,
  learningStyleId: null,
  codeLanguageId: null,
  showOnLeaderboard: null,
  textToSpeech: null,
};

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...initialAnswers,
  setAnswers: (answers) => set(answers),
  reset: () => set(initialAnswers),
}));
