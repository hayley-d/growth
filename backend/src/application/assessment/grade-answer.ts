import type { LearnerAnswer } from "@shared/schemas";

const normaliseText = (text: string) => text.toLowerCase().replace(/\s+/g, "");

const matches = (response: LearnerAnswer, accepted: LearnerAnswer): boolean => {
  switch (accepted.type) {
    case "multiple_choice":
      return response.type === "multiple_choice" && response.optionId === accepted.optionId;
    case "build_tree":
      return response.type === "build_tree" && response.tree.trim() === accepted.tree.trim();
    case "order_nodes":
      return (
        response.type === "order_nodes" &&
        response.keys.length === accepted.keys.length &&
        response.keys.every((key, index) => key === accepted.keys[index])
      );
    case "predict_rotation":
      return (
        response.type === "predict_rotation" &&
        response.rotation === accepted.rotation &&
        response.pivotKey === accepted.pivotKey
      );
    case "text":
      return (
        response.type === "text" && normaliseText(response.text) === normaliseText(accepted.text)
      );
  }
};

export const gradeAnswer = (response: LearnerAnswer, accepted: readonly LearnerAnswer[]): boolean =>
  accepted.some((candidate) => matches(response, candidate));
