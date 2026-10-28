export type CaseStudy = {
  id: string;
  lessonId: string;
  title: string;
  scenario: string;
  body: string;
  task: unknown;
  position: number;
};

export type NewCaseStudy = {
  lessonId: string;
  title: string;
  scenario: string;
  body: string;
  task: unknown;
  position: number;
};

export type CaseStudyChanges = Partial<NewCaseStudy>;
