import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

export type DragSource = { kind: "new"; key: number } | { kind: "node"; key: number };

export type DropTarget =
  | { kind: "slot"; slotId: string }
  | { kind: "bin" }
  | { kind: "predict" }
  | { kind: "node"; key: number };

export type ActiveDrag = {
  source: DragSource;
  x: number;
  y: number;
  moved: boolean;
  over: DropTarget | null;
};

type PointerDragOptions = {
  onDrop: (source: DragSource, target: DropTarget) => void;
  onStart?: (source: DragSource) => void;
};

const moveThreshold = 5;

export const dropTargetAt = (x: number, y: number, source: DragSource): DropTarget | null => {
  const element = document.elementFromPoint(x, y);
  if (!element) return null;
  const node = element.closest<HTMLElement>("[data-node-key]");
  if (node) {
    const key = Number(node.dataset.nodeKey);
    return source.kind === "node" && key === source.key ? null : { kind: "node", key };
  }
  const drop = element.closest<HTMLElement>("[data-drop]");
  const kind = drop?.dataset.drop;
  if (drop && kind === "slot") return { kind: "slot", slotId: drop.dataset.slotId ?? "" };
  if (kind === "bin" || kind === "predict") return { kind };
  return null;
};

export const sameTarget = (left: DropTarget | null, right: DropTarget | null) => {
  if (left === null || right === null) return left === right;
  if (left.kind === "slot" && right.kind === "slot") return left.slotId === right.slotId;
  if (left.kind === "node" && right.kind === "node") return left.key === right.key;
  return left.kind === right.kind;
};

export function usePointerDrag({ onDrop, onStart }: PointerDragOptions) {
  const [drag, setDrag] = useState<ActiveDrag | null>(null);
  const current = useRef<ActiveDrag | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const handlers = useRef({ onDrop, onStart });
  handlers.current = { onDrop, onStart };
  const suppressClick = useRef(false);
  const ghostRef = useRef<HTMLDivElement>(null);

  const update = useCallback((next: ActiveDrag | null) => {
    current.current = next;
    setDrag(next);
  }, []);

  const startDrag = useCallback(
    (event: PointerEvent<HTMLElement>, source: DragSource) => {
      if (event.button !== 0) return;
      origin.current = { x: event.clientX, y: event.clientY };
      update({ source, x: event.clientX, y: event.clientY, moved: false, over: null });
    },
    [update],
  );

  const consumeClick = useCallback(() => {
    const suppressed = suppressClick.current;
    suppressClick.current = false;
    return suppressed;
  }, []);

  const isDragging = drag !== null;

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (event: globalThis.PointerEvent) => {
      const active = current.current;
      if (!active) return;
      const distance = Math.hypot(
        event.clientX - origin.current.x,
        event.clientY - origin.current.y,
      );
      const moved = active.moved || distance > moveThreshold;
      if (moved && !active.moved) handlers.current.onStart?.(active.source);
      if (moved) event.preventDefault();
      const over = moved ? dropTargetAt(event.clientX, event.clientY, active.source) : null;
      const next = { ...active, x: event.clientX, y: event.clientY };
      if (moved !== active.moved || !sameTarget(over, active.over)) {
        update({ ...next, moved, over });
        return;
      }
      current.current = next;
      const ghost = ghostRef.current;
      if (ghost) {
        ghost.style.left = `${event.clientX}px`;
        ghost.style.top = `${event.clientY}px`;
      }
    };
    const handleUp = (event: globalThis.PointerEvent) => {
      const active = current.current;
      update(null);
      if (!active?.moved) return;
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      const target = dropTargetAt(event.clientX, event.clientY, active.source);
      if (target) handlers.current.onDrop(active.source, target);
    };
    const handleCancel = () => update(null);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [isDragging, update]);

  return { drag, startDrag, consumeClick, ghostRef };
}
