import type { PracticeTopic } from "@shared/schemas";
import { cn } from "@/lib/utils";

// A tiny tree that shows what each practice topic asks you to do.
const nodeR = 9;

function Node({
  x,
  y,
  fill = "var(--card)",
  stroke = "currentColor",
  dashed,
  label,
}: {
  x: number;
  y: number;
  fill?: string;
  stroke?: string;
  dashed?: boolean;
  label?: string;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={nodeR}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={dashed ? "3 3" : undefined}
      />
      {label ? (
        <text
          x={x}
          y={y + 3.5}
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

const Edge = ({ a, b, dashed }: { a: [number, number]; b: [number, number]; dashed?: boolean }) => (
  <line
    x1={a[0]}
    y1={a[1]}
    x2={b[0]}
    y2={b[1]}
    stroke="currentColor"
    strokeOpacity={0.45}
    strokeWidth={2}
    strokeDasharray={dashed ? "3 3" : undefined}
  />
);

export function PracticeTopicGlyph({
  topic,
  className,
}: {
  topic: PracticeTopic;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 84" aria-hidden="true" className={cn("text-foreground", className)}>
      {topic === "traversals" ? (
        <>
          <path
            d="M60 6 C 20 6, 14 70, 34 72 C 50 74, 52 40, 60 40 C 68 40, 70 74, 86 72 C 106 70, 100 6, 60 6"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeDasharray="2 4"
            strokeLinecap="round"
          />
          <Edge a={[60, 20]} b={[34, 56]} />
          <Edge a={[60, 20]} b={[86, 56]} />
          <Node x={60} y={20} fill="var(--primary)" label="2" />
          <Node x={34} y={56} fill="var(--primary)" label="1" />
          <Node x={86} y={56} fill="var(--primary)" label="3" />
        </>
      ) : null}
      {topic === "insertion" ? (
        <>
          <Edge a={[60, 16]} b={[34, 46]} />
          <Edge a={[60, 16]} b={[86, 46]} />
          <Edge a={[86, 46]} b={[100, 74]} dashed />
          <Node x={60} y={16} label="20" />
          <Node x={34} y={46} label="10" />
          <Node x={86} y={46} label="30" />
          <Node x={100} y={74} fill="var(--accent)" stroke="var(--accent)" label="35" />
        </>
      ) : null}
      {topic === "deletion" ? (
        <>
          <Edge a={[60, 16]} b={[34, 46]} />
          <Edge a={[60, 16]} b={[86, 46]} dashed />
          <Edge a={[34, 46]} b={[20, 74]} />
          <Node x={60} y={16} label="20" />
          <Node x={34} y={46} label="10" />
          <Node x={20} y={74} label="5" />
          <Node x={86} y={46} fill="transparent" stroke="var(--secondary)" dashed label="30" />
          <path
            d="M79 39 L93 53 M93 39 L79 53"
            stroke="var(--secondary)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </>
      ) : null}
      {topic === "rotations" ? (
        <>
          <Edge a={[40, 14]} b={[60, 42]} />
          <Edge a={[60, 42]} b={[80, 70]} />
          <Node x={40} y={14} fill="var(--secondary)" label="10" />
          <Node x={60} y={42} label="20" />
          <Node x={80} y={70} label="30" />
          <path
            d="M18 52 C 14 24, 26 10, 30 10"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <path
            d="M25 6 L31 10 L25 15"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {topic === "mixed" ? (
        <>
          <Edge a={[60, 14]} b={[34, 42]} />
          <Edge a={[60, 14]} b={[86, 42]} />
          <Edge a={[34, 42]} b={[20, 70]} />
          <Edge a={[86, 42]} b={[100, 70]} />
          <Node x={60} y={14} fill="var(--primary)" />
          <Node x={34} y={42} fill="var(--secondary)" />
          <Node x={86} y={42} fill="var(--accent)" />
          <Node x={20} y={70} fill="var(--accent)" />
          <Node x={100} y={70} fill="var(--primary)" />
        </>
      ) : null}
    </svg>
  );
}
