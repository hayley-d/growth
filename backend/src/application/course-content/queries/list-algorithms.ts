import { algorithmCodes } from "@shared/avl";
import { type ListAlgorithmsResponse, toListAlgorithmsResponse } from "@shared/schemas/algorithm";
import type { Algorithm } from "@/domain/course-content/algorithm";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";

type ListAlgorithmsDependencies = {
  algorithmRepository: Pick<AlgorithmRepository, "listAll">;
};

const catalogueOrder = (algorithm: Algorithm) => {
  const position = (algorithmCodes as readonly string[]).indexOf(algorithm.code);
  return position === -1 ? algorithmCodes.length : position;
};

export const makeListAlgorithms =
  ({ algorithmRepository }: ListAlgorithmsDependencies) =>
  async (): Promise<ListAlgorithmsResponse> => {
    const algorithms = await algorithmRepository.listAll();
    return toListAlgorithmsResponse(
      [...algorithms].sort((first, second) => catalogueOrder(first) - catalogueOrder(second)),
    );
  };

export type ListAlgorithms = ReturnType<typeof makeListAlgorithms>;
