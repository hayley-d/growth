import { z } from "zod";

import {
  bloomsLevelSchema,
  caseStudyTaskSchema,
  contentBlockBodySchema,
  generatorKeySchema,
  generatorOptionsSchema,
  learnerAnswerSchema,
  lessonKindSchema,
  questionTypeSchema,
} from "@shared/schemas";

export const contentKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lower case letters, numbers and single dashes");

export const learningStyleNames = {
  visual: "Visual",
  auditory: "Auditory",
  "reading-writing": "Reading/writing",
  kinesthetic: "Kinesthetic",
} as const;

export const contentStyleSchema = z.enum(["visual", "auditory", "reading-writing", "kinesthetic"]);

export type ContentStyle = z.infer<typeof contentStyleSchema>;

const textSchema = z.string().trim().min(1);

const positionSchema = z.int().min(1);

export const unitContentSchema = z.object({
  key: contentKeySchema,
  position: positionSchema,
  title: textSchema,
});

export const unitsContentSchema = z.array(unitContentSchema);

export type UnitContent = z.input<typeof unitContentSchema>;

export type UnitData = z.output<typeof unitContentSchema>;

export const lessonContentSchema = z.object({
  key: contentKeySchema,
  unit: contentKeySchema,
  position: positionSchema,
  title: textSchema,
  summary: textSchema,
  kind: lessonKindSchema,
  notePrompt: textSchema.optional(),
  objectives: z.array(textSchema).min(1, "Write at least one objective"),
});

export type LessonContent = z.input<typeof lessonContentSchema>;

export type LessonData = z.output<typeof lessonContentSchema>;

export const blockPlacementSchema = z.object({
  position: positionSchema,
  style: contentStyleSchema.optional(),
  transcript: textSchema,
});

export const blockContentSchema = contentBlockBodySchema.and(blockPlacementSchema);

export type BlockContent = z.input<typeof blockContentSchema>;

export type BlockData = z.output<typeof blockContentSchema>;

const writtenQuestionFields = {
  key: contentKeySchema,
  difficulty: z.int().min(1).max(5),
  bloomsLevel: bloomsLevelSchema,
  prompt: textSchema,
  explanation: textSchema,
  reviewLesson: contentKeySchema,
  hints: z.array(textSchema).min(2, "Write at least two hints"),
};

const answerOptionContentSchema = z.object({
  key: contentKeySchema,
  text: textSchema,
  isCorrect: z.boolean(),
});

const acceptedAnswerContentSchema = z.object({
  key: contentKeySchema,
  text: textSchema,
});

export const writtenQuestionContentSchema = z.discriminatedUnion("type", [
  z.object({
    ...writtenQuestionFields,
    type: z.literal("multiple_choice"),
    tree: z.string().optional(),
    options: z.array(answerOptionContentSchema).min(2, "Write at least two options"),
  }),
  z.object({
    ...writtenQuestionFields,
    type: z.literal("text"),
    tree: z.string().optional(),
    accepted: z.array(acceptedAnswerContentSchema).min(1, "Write at least one accepted answer"),
  }),
  z.object({
    ...writtenQuestionFields,
    type: z.literal("build_tree"),
    tree: z.string(),
    answer: learnerAnswerSchema,
  }),
  z.object({
    ...writtenQuestionFields,
    type: z.literal("order_nodes"),
    tree: z.string(),
    answer: learnerAnswerSchema,
  }),
  z.object({
    ...writtenQuestionFields,
    type: z.literal("predict_rotation"),
    tree: z.string(),
    answer: learnerAnswerSchema,
  }),
]);

export const writtenQuestionsContentSchema = z.array(writtenQuestionContentSchema);

export type WrittenQuestionContent = z.input<typeof writtenQuestionContentSchema>;

export type WrittenQuestionData = z.output<typeof writtenQuestionContentSchema>;

export const generatedQuestionContentSchema = z.object({
  key: contentKeySchema,
  generatorKey: generatorKeySchema,
  generatorOptions: generatorOptionsSchema.optional(),
  type: questionTypeSchema,
  difficulty: z.int().min(1).max(5),
  bloomsLevel: bloomsLevelSchema,
  reviewLesson: contentKeySchema,
});

export const generatedQuestionsContentSchema = z.array(generatedQuestionContentSchema);

export type GeneratedQuestionContent = z.input<typeof generatedQuestionContentSchema>;

export type GeneratedQuestionData = z.output<typeof generatedQuestionContentSchema>;

export const caseStudyContentSchema = z.object({
  key: contentKeySchema,
  lesson: contentKeySchema,
  position: positionSchema,
  title: textSchema,
  scenario: textSchema,
  body: textSchema,
  task: caseStudyTaskSchema,
});

export type CaseStudyContent = z.input<typeof caseStudyContentSchema>;

export type CaseStudyData = z.output<typeof caseStudyContentSchema>;
