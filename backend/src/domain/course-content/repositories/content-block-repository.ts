import type { Repository } from "@/domain/common/repository";
import type {
  ContentBlock,
  ContentBlockChanges,
  NewContentBlock,
} from "@/domain/course-content/content-block";

export type ContentBlockRepository = Repository<ContentBlock, NewContentBlock, ContentBlockChanges>;
