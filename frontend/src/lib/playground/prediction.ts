export type PredictionCheck = {
  right: boolean;
  marks: boolean[];
  message: string;
};

export const checkPrediction = (
  guess: readonly number[],
  walk: readonly number[],
): PredictionCheck => {
  const marks = guess.map((key, index) => walk[index] === key);
  const wrongIndex = marks.indexOf(false);
  const complete = guess.length === walk.length;
  if (wrongIndex === -1 && complete) {
    return {
      right: true,
      marks,
      message: "Right, every place matches. Watch the walk to see why.",
    };
  }
  if (wrongIndex === -1) {
    return {
      right: false,
      marks,
      message: `So far so good, but the walk visits ${walk.length} nodes and you placed ${guess.length}.`,
    };
  }
  return {
    right: false,
    marks,
    message: `Place ${wrongIndex + 1} is ${walk[wrongIndex]}, not ${guess[wrongIndex]}. Watch the walk to see where it goes.`,
  };
};
