export type WrongTap = {
  key: number;
  beat: number;
};

export type TraversalTaps = {
  placed: number[];
  wrong: WrongTap[];
};

export const emptyTaps: TraversalTaps = { placed: [], wrong: [] };

export const tapNode = (
  taps: TraversalTaps,
  key: number,
  expected: readonly number[],
): TraversalTaps => {
  const beat = taps.placed.length;
  if (beat >= expected.length || taps.placed.includes(key)) return taps;
  if (expected[beat] === key) return { ...taps, placed: [...taps.placed, key] };
  return { ...taps, wrong: [...taps.wrong, { key, beat }] };
};

export const isFinished = (taps: TraversalTaps, expected: readonly number[]) =>
  expected.length > 0 && taps.placed.length === expected.length;

export const tapMessage = (taps: TraversalTaps, expected: readonly number[], orderName: string) => {
  if (isFinished(taps, expected)) {
    return `That's the whole ${orderName} order: ${taps.placed.join(", ")}.`;
  }
  const lastWrong = taps.wrong.at(-1);
  if (lastWrong && lastWrong.beat === taps.placed.length) {
    return `Not ${lastWrong.key}. Beat ${lastWrong.beat + 1} is still open, try another node.`;
  }
  if (taps.placed.length === 0) return `Tap the first node in ${orderName}.`;
  return `${taps.placed.at(-1)} is right. Tap the node for beat ${taps.placed.length + 1}.`;
};
