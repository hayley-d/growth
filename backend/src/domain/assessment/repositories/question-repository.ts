import type { NewQuestion, Question, QuestionChanges } from "@/domain/assessment/question";
import type { Repository } from "@/domain/common/repository";

export type QuestionRepository = Repository<Question, NewQuestion, QuestionChanges>;
