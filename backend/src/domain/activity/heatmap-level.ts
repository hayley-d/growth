export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export function getHeatmapLevel(count: number): HeatmapLevel {
  if (count >= 20) {
    return 4;
  }
  if (count >= 10) {
    return 3;
  }
  if (count >= 5) {
    return 2;
  }
  if (count >= 1) {
    return 1;
  }
  return 0;
}
