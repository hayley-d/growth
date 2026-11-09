import type { LearnerAnswer } from "@shared/schemas";
import { makeRequestHint } from "@/application/assessment/commands/request-hint";
import { makeStartAttempt } from "@/application/assessment/commands/start-attempt";
import { makeSubmitAnswer } from "@/application/assessment/commands/submit-answer";
import { makeGetAttempt } from "@/application/assessment/queries/get-attempt";
import {
  asLearner,
  createRandom,
  createWorld,
  type World,
} from "@/test/application/assessment/attempt-fakes";

export const createUseCases = (world: World = createWorld(), random = createRandom()) => ({
  world,
  startAttempt: makeStartAttempt({
    ...world.dependencies,
    canTakeTest: async (_userId: string, lessonId: string) =>
      (await world.dependencies.lessonRepository.findById(lessonId)) !== null,
    random,
  }),
  getAttempt: makeGetAttempt(world.dependencies),
  requestHint: makeRequestHint(world.dependencies),
  submitAnswer: makeSubmitAnswer(world.dependencies),
});

export type UseCases = ReturnType<typeof createUseCases>;

export const startFor = async (useCases: UseCases, lessonId = "lesson-a") => {
  const { response } = await asLearner(() => useCases.startAttempt({ id: lessonId }));
  return response.data;
};

export const wrongAnswerFor = (type: LearnerAnswer["type"]): LearnerAnswer => {
  switch (type) {
    case "multiple_choice":
      return { type, optionId: "option-wrong" };
    case "build_tree":
      return { type, tree: "9,#,#" };
    case "order_nodes":
      return { type, keys: [999] };
    case "predict_rotation":
      return { type, rotation: "none", pivotKey: null };
    case "text":
      return { type, text: "nope" };
  }
};

export const answerAll = async (
  useCases: UseCases,
  attemptId: string,
  shouldBeCorrect: (position: number) => boolean = () => true,
) => {
  let last: Awaited<ReturnType<UseCases["submitAnswer"]>> | null = null;
  let state = await asLearner(() => useCases.getAttempt({ id: attemptId }));
  while (state.data.question) {
    const { question } = state.data;
    const answer = shouldBeCorrect(question.position)
      ? useCases.world.correctAnswerOf(question.id)
      : wrongAnswerFor(question.type);
    last = await asLearner(() =>
      useCases.submitAnswer({ id: attemptId, questionId: question.id, answer }),
    );
    state = {
      data: { attempt: last.data.attempt, question: last.data.question, result: last.data.result },
    };
  }
  return last;
};
