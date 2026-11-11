import { beforeEach, describe, expect, it } from "vitest";

import { useOnboardingStore } from "@/stores/onboarding-store";

beforeEach(() => {
  useOnboardingStore.getState().reset();
});

describe("useOnboardingStore", () => {
  it("starts on the first step with nothing answered", () => {
    expect(useOnboardingStore.getState()).toMatchObject({
      step: 0,
      quizAnswers: {},
      scoredLearningStyleId: null,
      learningStyleId: null,
      codeLanguageId: null,
      showOnLeaderboard: null,
      textToSpeech: null,
    });
  });

  it("keeps earlier answers when later ones change", () => {
    const { setAnswers } = useOnboardingStore.getState();

    setAnswers({ quizAnswers: { "flat-pack-desk": "a" }, step: 1 });
    setAnswers({ codeLanguageId: "java", step: 2 });
    setAnswers({ step: 1 });

    expect(useOnboardingStore.getState()).toMatchObject({
      step: 1,
      quizAnswers: { "flat-pack-desk": "a" },
      codeLanguageId: "java",
    });
  });

  it("forgets everything on reset", () => {
    const { setAnswers, reset } = useOnboardingStore.getState();
    setAnswers({ step: 3, textToSpeech: true, quizAnswers: { "new-app": "c" } });

    reset();

    expect(useOnboardingStore.getState()).toMatchObject({
      step: 0,
      quizAnswers: {},
      textToSpeech: null,
    });
  });
});
