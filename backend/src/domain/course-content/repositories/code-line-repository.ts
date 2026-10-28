import type { Repository } from "@/domain/common/repository";
import type {
  CodeLine,
  CodeLineChanges,
  CodeLineKey,
  NewCodeLine,
} from "@/domain/course-content/code-line";

export type CodeLineRepository = Repository<CodeLine, NewCodeLine, CodeLineChanges, CodeLineKey>;
