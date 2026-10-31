import type { NodeState } from "@shared/engine";
import { TreeNodeCircle } from "@/components/atoms/tree-node-circle";

export const treeNodeRadius = 18;
export const treeNodeLabelLine = 14;
export const treeNodeLabelGap = 16;
export const treeNodePad = 22;

export const treeNodeLabelHeight = (showHeight: boolean, showBalance: boolean) =>
  (showHeight ? treeNodeLabelLine : 0) + (showBalance ? treeNodeLabelLine : 0);

type TreeNodeProperties = {
  x: number;
  y: number;
  nodeKey: number;
  height: number;
  balance: number;
  state?: NodeState;
  showHeight: boolean;
  showBalance: boolean;
  manual: boolean;
  selected: boolean;
  onSelect?: (nodeKey: number) => void;
};

type Paint = {
  fill: string;
  stroke: string;
  text: string;
  strokeWidth: number;
  dashed: boolean;
};

const idlePaint: Paint = {
  fill: "var(--background)",
  stroke: "var(--border)",
  text: "currentColor",
  strokeWidth: 1.5,
  dashed: false,
};

const paints: Record<NodeState, Paint> = {
  active: {
    fill: "var(--accent)",
    stroke: "var(--accent-foreground)",
    text: "var(--accent-foreground)",
    strokeWidth: 1.5,
    dashed: false,
  },
  visited: {
    fill: "var(--muted)",
    stroke: "var(--muted-foreground)",
    text: "var(--muted-foreground)",
    strokeWidth: 1.5,
    dashed: false,
  },
  "about to be deleted": {
    fill: "var(--destructive)",
    stroke: "currentColor",
    text: "var(--destructive-foreground)",
    strokeWidth: 1.5,
    dashed: true,
  },
  unbalanced: {
    fill: "var(--warning)",
    stroke: "var(--warning-foreground)",
    text: "var(--warning-foreground)",
    strokeWidth: 1.5,
    dashed: false,
  },
  new: {
    fill: "var(--background)",
    stroke: "var(--primary)",
    text: "var(--primary)",
    strokeWidth: 2.5,
    dashed: false,
  },
};

const accessibleName = (nodeKey: number, balance: number, state?: NodeState) => {
  const factor = `balance factor ${balance}`;
  return state === undefined ? `${nodeKey}, ${factor}` : `${nodeKey}, ${state}, ${factor}`;
};

type MarkProperties = {
  x: number;
  y: number;
};

function Pointer({ x, y }: MarkProperties) {
  const tip = y - treeNodeRadius - 3;
  const base = tip - 12;
  return <polygon points={`${x},${tip} ${x - 6},${base} ${x + 6},${base}`} fill="currentColor" />;
}

function Tick({ x, y }: MarkProperties) {
  const originX = x + treeNodeRadius - 1;
  const originY = y + 4;
  return (
    <polyline
      points={`${originX},${originY} ${originX + 5},${originY + 5} ${originX + 13},${originY - 5}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Cross({ x, y }: MarkProperties) {
  const centerX = x + treeNodeRadius + 1;
  const centerY = y - treeNodeRadius + 1;
  const arm = 5;
  return (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1={centerX - arm} y1={centerY - arm} x2={centerX + arm} y2={centerY + arm} />
      <line x1={centerX - arm} y1={centerY + arm} x2={centerX + arm} y2={centerY - arm} />
    </g>
  );
}

function BalanceBadge({ x, y, balance }: MarkProperties & { balance: number }) {
  const centerX = x + treeNodeRadius * 0.7;
  const centerY = y - treeNodeRadius * 0.7;
  return (
    <g>
      <TreeNodeCircle
        x={centerX}
        y={centerY}
        radius={11}
        fill="var(--background)"
        stroke="currentColor"
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fill="currentColor"
      >
        {balance}
      </text>
    </g>
  );
}

export function TreeNode({
  x,
  y,
  nodeKey,
  height,
  balance,
  state,
  showHeight,
  showBalance,
  manual,
  selected,
  onSelect,
}: TreeNodeProperties) {
  const paint = state === undefined ? idlePaint : paints[state];
  const labels = [showHeight ? `h ${height}` : null, showBalance ? `bf ${balance}` : null].filter(
    (label): label is string => label !== null,
  );
  const hit = treeNodeRadius * 2;

  return (
    <g>
      <g aria-hidden={manual ? true : undefined}>
        {state === "active" ? <Pointer x={x} y={y} /> : null}
        <TreeNodeCircle
          x={x}
          y={y}
          radius={treeNodeRadius}
          fill={paint.fill}
          stroke={paint.stroke}
          strokeWidth={paint.strokeWidth}
          strokeDasharray={paint.dashed ? "4 3" : undefined}
        />
        {state === "active" ? (
          <TreeNodeCircle
            x={x}
            y={y}
            radius={treeNodeRadius + 5}
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
          />
        ) : null}
        {selected ? (
          <TreeNodeCircle
            x={x}
            y={y}
            radius={treeNodeRadius + 10}
            fill="none"
            stroke="var(--ring)"
            strokeWidth={2}
          />
        ) : null}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          fill={paint.text}
        >
          {nodeKey}
        </text>
        {state === "visited" ? <Tick x={x} y={y} /> : null}
        {state === "about to be deleted" ? <Cross x={x} y={y} /> : null}
        {state === "unbalanced" ? <BalanceBadge x={x} y={y} balance={balance} /> : null}
        {labels.map((label, index) => (
          <text
            key={label}
            x={x}
            y={y + treeNodeRadius + treeNodeLabelGap + index * treeNodeLabelLine}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fill="currentColor"
          >
            {label}
          </text>
        ))}
      </g>
      {manual ? (
        <foreignObject x={x - treeNodeRadius} y={y - treeNodeRadius} width={hit} height={hit}>
          <button
            type="button"
            aria-label={accessibleName(nodeKey, balance, state)}
            aria-pressed={selected}
            onClick={() => onSelect?.(nodeKey)}
            style={{ width: hit, height: hit }}
            className="cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </foreignObject>
      ) : null}
    </g>
  );
}
