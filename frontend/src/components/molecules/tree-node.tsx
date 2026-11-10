import type { NodeState } from "@shared/avl";
import { TreeNodeCircle } from "@/components/atoms/tree-node-circle";
import { useSvgPlace } from "@/lib/use-svg-place";

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
  badge?: number;
  instant: boolean;
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
    fill: "var(--primary)",
    stroke: "var(--primary-foreground)",
    text: "var(--primary-foreground)",
    strokeWidth: 1.5,
    dashed: false,
  },
  visited: idlePaint,
  deleting: {
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
  rotating: {
    fill: "var(--accent)",
    stroke: "var(--accent-foreground)",
    text: "var(--accent-foreground)",
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

const keyFontSize = (nodeKey: number) => {
  const digits = String(nodeKey).length;
  return digits <= 2 ? 13 : Math.max(8, 13 - (digits - 2) * 2);
};

const stateNames: Record<NodeState, string> = {
  active: "active",
  visited: "visited",
  deleting: "about to be deleted",
  unbalanced: "unbalanced",
  rotating: "rotating",
  new: "new",
};

const accessibleName = (nodeKey: number, balance: number, state?: NodeState, badge?: number) => {
  const factor = `balance factor ${balance}`;
  const base =
    state === undefined ? `${nodeKey}, ${factor}` : `${nodeKey}, ${stateNames[state]}, ${factor}`;
  return badge === undefined ? base : `${base}, number ${badge}`;
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

function BalanceBadge({
  x,
  y,
  balance,
  emphasised,
}: MarkProperties & { balance: number; emphasised: boolean }) {
  const offset = treeNodeRadius * 0.75;
  const centerX = x + offset;
  const centerY = y - offset;
  return (
    <g>
      <TreeNodeCircle
        x={centerX}
        y={centerY}
        radius={emphasised ? 10 : 9}
        fill="var(--background)"
        stroke={emphasised ? "currentColor" : "var(--muted-foreground)"}
        strokeWidth={emphasised ? 2 : 1.5}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={emphasised ? 10 : 9}
        fontWeight={emphasised ? 700 : 600}
        fill="currentColor"
      >
        {balance}
      </text>
    </g>
  );
}

function NumberBadge({ x, y, value }: MarkProperties & { value: number }) {
  const offset = treeNodeRadius * 0.75;
  const centerX = x - offset;
  const centerY = y - offset;
  return (
    <g>
      <TreeNodeCircle
        x={centerX}
        y={centerY}
        radius={10}
        fill="var(--primary)"
        stroke="var(--primary-foreground)"
        strokeWidth={1.5}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="700"
        fill="var(--primary-foreground)"
      >
        {value}
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
  badge,
  instant,
  onSelect,
}: TreeNodeProperties) {
  const placeRef = useSvgPlace(x, y, instant);
  const paint = state === undefined ? idlePaint : paints[state];
  const labels = [showHeight ? `h ${height}` : null].filter(
    (label): label is string => label !== null,
  );
  const hit = treeNodeRadius * 2;

  return (
    <g ref={placeRef}>
      <g transform={`translate(${-x} ${-y})`}>
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
            fontSize={keyFontSize(nodeKey)}
            fontWeight="600"
            fill={paint.text}
          >
            {nodeKey}
          </text>
          {state === "deleting" ? <Cross x={x} y={y} /> : null}
          {badge === undefined ? null : <NumberBadge x={x} y={y} value={badge} />}
          {showBalance || state === "unbalanced" ? (
            <BalanceBadge x={x} y={y} balance={balance} emphasised={state === "unbalanced"} />
          ) : null}

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
              aria-label={accessibleName(nodeKey, balance, state, badge)}
              aria-pressed={selected || badge !== undefined}
              data-node-key={nodeKey}
              onClick={() => onSelect?.(nodeKey)}
              style={{ width: hit, height: hit }}
              className="cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </foreignObject>
        ) : null}
      </g>
    </g>
  );
}
