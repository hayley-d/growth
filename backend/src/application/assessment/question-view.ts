import {
  type GeneratedQuestion,
  generatedQuestionSchema,
  type LearnerAnswer,
  learnerAnswerSchema,
  type QuestionType,
  type Replay,
} from "@shared/schemas";
import type { Logger } from "@/application/logging/logger";
import type { AttemptQuestion } from "@/domain/assessment/attempt-question";
import type { Question } from "@/domain/assessment/question";
import type { AnswerOptionRepository } from "@/domain/assessment/repositories/answer-option-repository";
import type { HintRepository } from "@/domain/assessment/repositories/hint-repository";
import { InvalidContentError } from "@/domain/errors";

export type QuestionView = {
  type: QuestionType;
  prompt: string;
  tree: string | null;
  options?: { id: string; text: string }[];
  accepted: LearnerAnswer[];
  explanation: string;
  replay: Replay | null;
  hints: string[];
};

type QuestionViewDependencies = {
  answerOptionRepository: Pick<AnswerOptionRepository, "listByQuestionId">;
  hintRepository: Pick<HintRepository, "listByQuestionId">;
  logger: Logger;
};

export const makeLoadQuestionView = ({
  answerOptionRepository,
  hintRepository,
  logger,
}: QuestionViewDependencies) => {
  const invalid = (message: string, questionId: string, details?: unknown): never => {
    logger.error(message, { questionId, details });
    throw new InvalidContentError("Question content is invalid", { questionId });
  };

  const viewGenerated = (attemptQuestion: AttemptQuestion): QuestionView => {
    const parsed = generatedQuestionSchema.safeParse(attemptQuestion.generatedQuestion);
    if (!parsed.success) {
      return invalid(
        "Stored generated question is invalid",
        attemptQuestion.questionId,
        parsed.error,
      );
    }
    const generated: GeneratedQuestion = parsed.data;
    return {
      type: generated.type,
      prompt: generated.prompt,
      tree: generated.tree,
      options: generated.options,
      accepted: [generated.answer],
      explanation: generated.explanation,
      replay: generated.replay ?? null,
      hints: generated.hints,
    };
  };

  const viewWritten = async (question: Question): Promise<QuestionView> => {
    const base = {
      type: question.type,
      prompt: question.prompt ?? "",
      tree: question.tree,
      explanation: question.explanation,
      replay: null,
    };
    const hints = (await hintRepository.listByQuestionId(question.id)).map((hint) => hint.text);

    if (question.type === "multiple_choice" || question.type === "text") {
      const answerOptions = await answerOptionRepository.listByQuestionId(question.id);
      const correct = answerOptions.filter((option) => option.isCorrect);
      if (question.type === "text") {
        if (correct.length === 0) invalid("Text question has no accepted answer", question.id);
        return {
          ...base,
          accepted: correct.map((option) => ({ type: "text", text: option.text })),
          hints,
        };
      }
      const [onlyCorrect] = correct;
      if (correct.length !== 1 || !onlyCorrect) {
        invalid("Multiple choice question needs exactly one correct option", question.id);
      }
      return {
        ...base,
        options: answerOptions.map(({ id, text }) => ({ id, text })),
        accepted: [{ type: "multiple_choice", optionId: (onlyCorrect as { id: string }).id }],
        hints,
      };
    }

    const parsed = learnerAnswerSchema.safeParse(question.answer);
    if (!parsed.success || parsed.data.type !== question.type) {
      return invalid("Stored question answer is invalid", question.id, parsed.error);
    }
    return { ...base, accepted: [parsed.data], hints };
  };

  return (attemptQuestion: AttemptQuestion, question: Question): Promise<QuestionView> =>
    attemptQuestion.generatedQuestion === null
      ? viewWritten(question)
      : Promise.resolve(viewGenerated(attemptQuestion));
};

export type LoadQuestionView = ReturnType<typeof makeLoadQuestionView>;
