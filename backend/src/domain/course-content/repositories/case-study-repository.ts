import type { Repository } from "@/domain/common/repository";
import type { CaseStudy, CaseStudyChanges, NewCaseStudy } from "@/domain/course-content/case-study";

export type CaseStudyRepository = Repository<CaseStudy, NewCaseStudy, CaseStudyChanges>;
