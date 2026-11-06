import { type ListLearningStylesResponse, toListLearningStylesResponse } from "@shared/schemas";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";

type ListLearningStylesDependencies = {
  learningStyleRepository: Pick<LearningStyleRepository, "listAll">;
};

export const makeListLearningStyles =
  ({ learningStyleRepository }: ListLearningStylesDependencies) =>
  async (): Promise<ListLearningStylesResponse> =>
    toListLearningStylesResponse(await learningStyleRepository.listAll());

export type ListLearningStyles = ReturnType<typeof makeListLearningStyles>;
