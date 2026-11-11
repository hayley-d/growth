import { type GetQuizResponse, toGetQuizResponse } from "@shared/schemas";
import { quizQuestions } from "@/domain/learning-style/quiz-questions";

export const makeGetQuiz = () => async (): Promise<GetQuizResponse> =>
  toGetQuizResponse(quizQuestions);

export type GetQuiz = ReturnType<typeof makeGetQuiz>;
