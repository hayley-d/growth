import type { Repository } from "@/domain/common/repository";
import type { Algorithm, AlgorithmChanges, NewAlgorithm } from "@/domain/course-content/algorithm";

export type AlgorithmRepository = Repository<Algorithm, NewAlgorithm, AlgorithmChanges> & {
  findByCode(code: string): Promise<Algorithm | null>;
};
