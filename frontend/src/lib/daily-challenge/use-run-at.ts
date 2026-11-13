import { useEffect } from "react";

const lateByMilliseconds = 1000;

export const useRunAt = (time: number | null, action: () => void) => {
  useEffect(() => {
    if (time === null) return;
    const timer = window.setTimeout(action, Math.max(0, time - Date.now()) + lateByMilliseconds);
    return () => window.clearTimeout(timer);
  }, [time, action]);
};
