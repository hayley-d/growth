import { generate } from "@shared/engine";
import {
  type GeneratedQuestion,
  generatorKeySchema,
  generatorOptionsSchema,
} from "@shared/schemas";
import { pickSeed, type Random } from "@/application/assessment/select-questions";
import type { Logger } from "@/application/logging/logger";
import type { Question } from "@/domain/assessment/question";
import { InvalidContentError } from "@/domain/errors";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

const startingDifficulty = 1;

export const generateQuestion = (
  logger: Logger,
  question: Question,
  seed: number,
  difficulty: number,
): GeneratedQuestion => {
  const key = generatorKeySchema.safeParse(question.generatorKey);
  const options = generatorOptionsSchema.safeParse(question.generatorOptions ?? {});
  if (!key.success || !options.success) {
    logger.error("Stored generator settings are invalid", { questionId: question.id });
    throw new InvalidContentError("Question content is invalid", { questionId: question.id });
  }
  return generate(key.data, {
    ...options.data,
    seed,
    difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
  });
};

type GenerateDraftDependencies = {
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
  logger: Logger;
  random: Random;
};

export const makeGenerateDraft =
  ({ userMasteryRepository, logger, random }: GenerateDraftDependencies) =>
  async (
    userId: string,
    question: Question,
    difficultyOverride?: number,
  ): Promise<{ seed: number; difficulty: number; generated: GeneratedQuestion }> => {
    const difficulty =
      difficultyOverride ??
      (await userMasteryRepository.findById({ userId, lessonId: question.lessonId }))
        ?.currentDifficulty ??
      startingDifficulty;
    const seed = pickSeed(random);
    return { seed, difficulty, generated: generateQuestion(logger, question, seed, difficulty) };
  };
