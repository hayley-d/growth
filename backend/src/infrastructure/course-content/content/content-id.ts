const contentNamespace = "3ba5bf40-d2ae-4a14-9e52-8b0ee6f6b083";

const contentId = (name: string) => Bun.randomUUIDv5(name, contentNamespace);

export const unitId = (unitKey: string) => contentId(`unit/${unitKey}`);

export const lessonId = (lessonKey: string) => contentId(`lesson/${lessonKey}`);

export const questionId = (lessonKey: string, questionKey: string) =>
  contentId(`question/${lessonKey}/${questionKey}`);

export const answerOptionId = (lessonKey: string, questionKey: string, optionKey: string) =>
  contentId(`answer-option/${lessonKey}/${questionKey}/${optionKey}`);
