import { type PracticeTopicsResponse, practiceTopicSchema } from "@shared/schemas";
import {
  makePracticePool,
  type PracticeDependencies,
} from "@/application/assessment/practice-session";
import { getSignedInUserId } from "@/application/lesson/lesson-access";

export const makeGetPracticeTopics = (dependencies: PracticeDependencies) => {
  const listPool = makePracticePool(dependencies);

  return async (): Promise<PracticeTopicsResponse> => {
    const userId = getSignedInUserId();
    return {
      data: await Promise.all(
        practiceTopicSchema.options.map(async (topic) => ({
          topic,
          available: (await listPool(userId, topic)).length > 0,
        })),
      ),
    };
  };
};

export type GetPracticeTopics = ReturnType<typeof makeGetPracticeTopics>;
