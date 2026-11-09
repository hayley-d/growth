import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ZoomControls } from "@/components/molecules/zoom-controls";
import { cn } from "@/lib/utils";

type TreeViewportProperties = {
  children: ReactNode;
  className?: string;
};

type PanStart = { x: number; y: number; left: number; top: number };

type Focus = { x: number; y: number };

export const zoomLevels = [0.5, 0.75, 1, 1.5, 2, 3, 4] as const;

const defaultLevel = zoomLevels.indexOf(1);

const noPanSelector = "[data-node-key], [data-drop], button";

const overflows = (element: HTMLElement) =>
  element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;

export function TreeViewport({ children, className }: TreeViewportProperties) {
  const [level, setLevel] = useState(defaultLevel);
  const [canPan, setCanPan] = useState(false);
  const [panning, setPanning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panStart = useRef<PanStart | null>(null);
  const pendingFocus = useRef<Focus | null>(null);
  const zoom = zoomLevels[level] ?? 1;

  const checkOverflow = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const focus = pendingFocus.current;
    if (focus) {
      pendingFocus.current = null;
      element.scrollLeft = focus.x * element.scrollWidth - element.clientWidth / 2;
      element.scrollTop = focus.y * element.scrollHeight - element.clientHeight / 2;
    }
    setCanPan(overflows(element));
  }, []);

  const zoomTo = (next: number) => {
    const element = scrollRef.current;
    if (element) {
      pendingFocus.current = {
        x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
        y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
      };
    }
    setLevel(Math.min(Math.max(next, 0), zoomLevels.length - 1));
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [checkOverflow]);

  useEffect(() => {
    if (!panning) return;
    const handleMove = (event: globalThis.PointerEvent) => {
      const element = scrollRef.current;
      const start = panStart.current;
      if (!element || !start) return;
      element.scrollLeft = start.left - (event.clientX - start.x);
      element.scrollTop = start.top - (event.clientY - start.y);
    };
    const handleEnd = () => {
      panStart.current = null;
      setPanning(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [panning]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || event.pointerType !== "mouse" || event.button !== 0) return;
    if (!overflows(element)) return;
    if ((event.target as Element).closest(noPanSelector)) return;
    event.preventDefault();
    panStart.current = {
      x: event.clientX,
      y: event.clientY,
      left: element.scrollLeft,
      top: element.scrollTop,
    };
    setPanning(true);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        className={cn(
          "flex h-full w-full overflow-auto overscroll-contain rounded-xl pt-16 pointer-fine:pt-14",
          canPan && "cursor-grab",
          panning && "cursor-grabbing select-none",
        )}
      >
        <div
          style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
          className="m-auto shrink-0"
        >
          {children}
        </div>
      </div>
      <ZoomControls
        zoom={zoom}
        canZoomIn={level < zoomLevels.length - 1}
        canZoomOut={level > 0}
        onZoomIn={() => zoomTo(level + 1)}
        onZoomOut={() => zoomTo(level - 1)}
        onReset={() => zoomTo(defaultLevel)}
        className="absolute top-2 right-2 z-10"
      />
    </div>
  );
}
