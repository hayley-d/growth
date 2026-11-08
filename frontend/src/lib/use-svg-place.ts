import { animate, useMotionValue } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { treeDropPx, treeGlideSec } from "@/lib/tree-motion";

const writePlace = (element: SVGGElement, x: number, y: number) => {
  element.setAttribute("transform", `translate(${x} ${y})`);
};

export function useSvgPlace(x: number, y: number, instant: boolean) {
  const ref = useRef<SVGGElement>(null);
  const placeX = useMotionValue(x);
  const placeY = useMotionValue(instant ? y : y - treeDropPx);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const write = () => writePlace(element, placeX.get(), placeY.get());
    write();
    const stopX = placeX.on("change", write);
    const stopY = placeY.on("change", write);
    if (instant || (placeX.get() === x && placeY.get() === y)) {
      placeX.set(x);
      placeY.set(y);
      write();
      return () => {
        stopX();
        stopY();
      };
    }
    const glide = { duration: treeGlideSec, ease: "easeInOut" as const };
    const xControl = animate(placeX, x, glide);
    const yControl = animate(placeY, y, glide);
    return () => {
      xControl.stop();
      yControl.stop();
      stopX();
      stopY();
    };
  }, [instant, placeX, placeY, x, y]);

  return ref;
}
