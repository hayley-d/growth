import {
  type ScoreQuizRequest,
  type ScoreQuizResponse,
  toScoreQuizResponse,
} from "@shared/schemas";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";
import { BadRequestError, InvalidContentError } from "@/domain/errors";
import { learningStyleNames } from "@/domain/learning-style/learning-style-key";
import { quizQuestions } from "@/domain/learning-style/quiz-questions";
import { scoreQuiz } from "@/domain/learning-style/score-quiz";

type ScoreQuizDependencies = {
  learningStyleRepository: Pick<LearningStyleRepository, "findByName">;
};

export const makeScoreQuiz =
  ({ learningStyleRepository }: ScoreQuizDependencies) =>
  async ({ answers }: ScoreQuizRequest): Promise<ScoreQuizResponse> => {
    const optionIdByQuestion = new Map(
      answers.map((answer) => [answer.questionId, answer.optionId]),
    );
    if (optionIdByQuestion.size !== answers.length || answers.length !== quizQuestions.length) {
      throw new BadRequestError("Answer every question once");
    }

    const picks = quizQuestions.map((question) => {
      const optionId = optionIdByQuestion.get(question.id);
      const option = question.options.find((candidate) => candidate.id === optionId);
      if (!option) {
        throw new BadRequestError("Answer every question once", { questionId: question.id });
      }
      return option.style;
    });

    const name = learningStyleNames[scoreQuiz(picks)];
    const learningStyle = await learningStyleRepository.findByName(name);
    if (!learningStyle) throw new InvalidContentError("Learning style is not seeded", { name });
    return toScoreQuizResponse(learningStyle);
  };

export type ScoreQuiz = ReturnType<typeof makeScoreQuiz>;
