import type {
  AnswerOption,
  AnswerOptionChanges,
  NewAnswerOption,
} from "@/domain/assessment/answer-option";
import type { Repository } from "@/domain/common/repository";

export type AnswerOptionRepository = Repository<AnswerOption, NewAnswerOption, AnswerOptionChanges>;
