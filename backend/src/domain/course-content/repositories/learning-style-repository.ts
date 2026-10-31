import type { Repository } from "@/domain/common/repository";
import type {
  LearningStyle,
  LearningStyleChanges,
  NewLearningStyle,
} from "@/domain/course-content/learning-style";

export type LearningStyleRepository = Repository<
  LearningStyle,
  NewLearningStyle,
  LearningStyleChanges
> & {
  findByName(name: string): Promise<LearningStyle | null>;
  upsertByName(learningStyle: NewLearningStyle): Promise<LearningStyle>;
};
