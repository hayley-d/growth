import type { LessonStep, LessonStepBlock } from "@shared/schemas";
import { contentBlockBodySchema } from "@shared/schemas";
import type { Logger } from "@/application/logging/logger";
import type { ContentBlock } from "@/domain/course-content/content-block";
import { InvalidContentError } from "@/domain/errors";

export const buildSteps = (
  blocks: readonly ContentBlock[],
  learningStyleId: string | null,
  logger: Logger,
): LessonStep[] => {
  const fail = (message: string, data: Record<string, unknown>): never => {
    logger.error(message, data);
    throw new InvalidContentError("Lesson content is invalid", data);
  };

  const toStepBlock = (block: ContentBlock): LessonStepBlock => {
    const parsed = contentBlockBodySchema.safeParse({ type: block.type, body: block.body });
    if (!parsed.success) {
      return fail("Lesson content block is invalid", {
        lessonId: block.lessonId,
        blockId: block.id,
        issues: parsed.error.issues,
      });
    }
    return { ...parsed.data, id: block.id, transcript: block.transcript };
  };

  const blocksByPosition = new Map<number, ContentBlock[]>();
  for (const block of blocks) {
    blocksByPosition.set(block.position, [...(blocksByPosition.get(block.position) ?? []), block]);
  }

  return [...blocksByPosition.entries()]
    .sort(([first], [second]) => first - second)
    .map(([position, group]) => {
      const coreBlocks = group.filter((block) => block.learningStyleId === null);
      const [core] = coreBlocks;
      if (!core || coreBlocks.length > 1) {
        return fail("Lesson step needs exactly one core block", {
          lessonId: group[0]?.lessonId,
          position,
        });
      }
      const styled = group.filter((block) => block.learningStyleId !== null);
      const style = styled.find((block) => block.learningStyleId === learningStyleId);
      return {
        position,
        coreBlock: toStepBlock(core),
        styleBlock: style ? toStepBlock(style) : null,
        otherBlocks: styled.filter((block) => block !== style).map(toStepBlock),
      };
    });
};
