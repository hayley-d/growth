type TreeNodeCircleProperties = {
  x: number;
  y: number;
  radius: number;
  fill: string;
  stroke: string;
  opacity?: number;
  strokeWidth?: number;
  strokeDasharray?: string;
};

export function TreeNodeCircle({
  x,
  y,
  radius,
  fill,
  stroke,
  opacity = 1,
  strokeWidth = 1.5,
  strokeDasharray,
}: TreeNodeCircleProperties) {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      opacity={opacity}
    />
  );
}
